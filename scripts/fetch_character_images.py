#!/usr/bin/env python3
"""
Fetch AniList character images for all characters missing imageUrl in characters.ts
Rate-limited to stay within AniList's 90 req/min limit.
"""
import json
import re
import time
import urllib.request
import urllib.error
from difflib import SequenceMatcher

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
API_URL = 'https://graphql.anilist.co'

QUERY = '''
query ($search: String, $page: Int) {
  Page(page: $page, perPage: 10) {
    characters(search: $search) {
      id
      name { full }
      image { large }
    }
  }
}
'''

def api_search(search_term, retries=3):
    """Search AniList for a character. Returns list of results."""
    payload = json.dumps({'query': QUERY, 'variables': {'search': search_term, 'page': 1}}).encode('utf-8')
    
    for attempt in range(retries):
        try:
            req = urllib.request.Request(API_URL, data=payload, headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': USER_AGENT
            })
            resp = urllib.request.urlopen(req)
            data = json.loads(resp.read())
            chars = data.get('data', {}).get('Page', {}).get('characters', [])
            return chars
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 5 * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s...")
                time.sleep(wait)
                continue
            elif e.code == 404:
                return []
            else:
                body = e.read().decode()
                print(f"  API error {e.code}: {body[:200]}")
                return []
        except Exception as e:
            print(f"  Request error: {e}")
            return []
    return []

def name_similarity(a, b):
    """Compare two names, handling common variations."""
    a = a.lower().strip()
    b = b.lower().strip()
    # Direct match
    if a == b:
        return 1.0
    # One contains the other
    if a in b or b in a:
        return 0.9
    return SequenceMatcher(None, a, b).ratio()

def find_best_match(results, name, series):
    """Find the best matching result from AniList."""
    if not results:
        return None
    
    name_lower = name.lower()
    series_lower = series.lower() if series else ""
    
    scored = []
    for r in results:
        anilist_name = r['name']['full']
        score = name_similarity(name_lower, anilist_name.lower())
        
        # Bonus if name appears in series-related context
        if series_lower:
            # No direct way to check series from character search,
            # but we can boost exact name matches
            if name_lower == anilist_name.lower():
                score += 0.2
        
        # Penalty if names are very different
        if score < 0.3:
            continue
            
        scored.append((score, r))
    
    if not scored:
        return None
    
    scored.sort(key=lambda x: -x[0])
    best = scored[0]
    if best[0] >= 0.4:
        return best[1]
    return None

def main():
    # Read characters.ts
    with open('lib/characters.ts', 'r') as f:
        content = f.read()
    
    # Parse all character entries with their raw text for later patching
    # Split on character object boundaries
    lines = content.split('\n')
    
    # Find all character entries
    entries = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith('{') and ('id:' in line or any(f'id: ' in lines[j] for j in range(max(0,i-2), i+1))):
            # Start of a character entry - collect lines until closing brace
            entry_lines = [line]
            brace_count = line.count('{') - line.count('}')
            i += 1
            while i < len(lines) and brace_count > 0:
                entry_lines.append(lines[i])
                brace_count += lines[i].count('{') - lines[i].count('}')
                i += 1
            entries.append('\n'.join(entry_lines))
        else:
            i += 1
    
    # Also do a regex-based parse for the header data
    # Parse each entry manually
    chunk_pattern = re.compile(r'(\s*\{[\s\S]*?\n\s*\})', re.MULTILINE)
    
    # Get the raw chunks more reliably
    raw_content = content
    # Find each character block between "  {" and "  }," or "  }"
    char_blocks = []
    start_idx = 0
    search_from = 0
    
    # Find all character objects by looking for the id field pattern
    pattern = re.compile(r'(  \{\n(?:.|\n)*?\n  \},?\n)', re.MULTILINE)
    for match in pattern.finditer(content):
        block = match.group(1)
        # Check if this block has an id field
        if re.search(r'id: "', block):
            char_blocks.append(block)
    
    print(f"Found {len(char_blocks)} character blocks")
    
    # Find missing-image characters
    missing = []
    for block in char_blocks:
        if 'imageUrl:' not in block:
            id_match = re.search(r'id: "(.+?)"', block)
            name_match = re.search(r'name: "(.+?)"', block)
            series_match = re.search(r'series: "(.+?)"', block)
            if id_match and name_match:
                missing.append({
                    'id': id_match.group(1),
                    'name': name_match.group(1),
                    'series': series_match.group(1) if series_match else '',
                    'block': block
                })
    
    print(f"Characters missing imageUrl: {len(missing)}")
    
    # Skip duplicates based on id pattern
    already_have_ids = set()
    for block in char_blocks:
        if 'imageUrl:' in block:
            id_match = re.search(r'id: "(.+?)"', block)
            if id_match:
                already_have_ids.add(id_match.group(1))
    
    # Process each missing character
    results = {}
    skipped = []
    
    for idx, char in enumerate(missing):
        cid = char['id']
        name = char['name']
        series = char['series']
        
        # Skip duplicates
        if cid in already_have_ids:
            skipped.append(cid)
            print(f"[{idx+1}/{len(missing)}] SKIP (dup) {name} ({series})")
            continue
        
        print(f"[{idx+1}/{len(missing)}] Searching: {name} ({series})... ", end='', flush=True)
        
        # Try search with full name first
        search_term = name
        # Clean up parenthetical notes for search
        search_term = re.sub(r'\s*\(.*?\)\s*', ' ', search_term).strip()
        # Remove "(already)" suffix
        search_term = re.sub(r'\s*already\s*$', '', search_term, flags=re.IGNORECASE).strip()
        
        results_list = api_search(search_term)
        
        if results_list:
            best = find_best_match(results_list, name, series)
            if best:
                img_url = best['image']['large']
                anilist_name = best['name']['full']
                results[cid] = img_url
                print(f"✓ {anilist_name} -> {img_url[:60]}...")
            else:
                # Try with just the first name
                first_name = search_term.split()[0] if search_term.split() else search_term
                if first_name and first_name != search_term:
                    time.sleep(0.7)  # Rate limit
                    results_list2 = api_search(first_name)
                    best2 = find_best_match(results_list2, name, series)
                    if best2:
                        img_url = best2['image']['large']
                        anilist_name = best2['name']['full']
                        results[cid] = img_url
                        print(f"✓ (using first name) {anilist_name} -> {img_url[:60]}...")
                    else:
                        print(f"✗ No match found (tried '{search_term}' and '{first_name}')")
                else:
                    print(f"✗ No match found for '{search_term}'")
        else:
            print(f"✗ No results")
        
        # Rate limiting: max 1 request per ~0.7s (≈85/min, under 90 limit)
        time.sleep(0.7)
    
    print(f"\n\n=== Results ===")
    print(f"Found images: {len(results)}")
    print(f"Skipped (dups): {len(skipped)}")
    
    # Save results as JSON
    with open('scripts/found_images.json', 'w') as f:
        json.dump(results, f, indent=2)
    print(f"Saved results to scripts/found_images.json")
    
    # Also generate the patch commands
    # For each result, we need to add an imageUrl line to the character entry
    # The simplest approach: add '  imageUrl: "url",' before the closing brace
    for cid, img_url in results.items():
        print(f"  {cid}: {img_url}")

if __name__ == '__main__':
    main()
