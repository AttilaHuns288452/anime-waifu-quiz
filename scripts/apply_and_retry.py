#!/usr/bin/env python3
"""
Apply AniList image results to characters.ts and do a second pass for failed ones.
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
      media(page: 1, perPage: 3) {
        nodes { title { romaji } }
      }
    }
  }
}
'''

def api_search(search_term):
    payload = json.dumps({'query': QUERY, 'variables': {'search': search_term, 'page': 1}}).encode('utf-8')
    for attempt in range(3):
        try:
            req = urllib.request.Request(API_URL, data=payload, headers={
                'Content-Type': 'application/json', 'Accept': 'application/json',
                'User-Agent': USER_AGENT
            })
            resp = urllib.request.urlopen(req)
            data = json.loads(resp.read())
            return data.get('data', {}).get('Page', {}).get('characters', [])
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 5 * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s...")
                time.sleep(wait)
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
    a = a.lower().strip()
    b = b.lower().strip()
    if a == b:
        return 1.0
    if a in b or b in a:
        return 0.9
    return SequenceMatcher(None, a, b).ratio()

def find_best_match(results, name, series_tokens):
    """Find best match considering name AND series."""
    if not results:
        return None
    
    name_lower = name.lower().strip()
    
    scored = []
    for r in results:
        anilist_name = r['name']['full'].lower().strip()
        name_score = name_similarity(name_lower, anilist_name)
        
        media_titles = []
        for m in r.get('media', {}).get('nodes', []):
            t = m.get('title', {}).get('romaji', '')
            if t:
                media_titles.append(t.lower())
        media_text = ' '.join(media_titles)
        
        series_bonus = 0
        for tok in series_tokens:
            tok = tok.lower().strip()
            if tok and len(tok) > 2:
                if tok in anilist_name:
                    series_bonus += 0.1
                if tok in media_text:
                    series_bonus += 0.15
        
        total = name_score + series_bonus
        
        # Strong penalty if name is completely different
        if name_score < 0.3 and series_bonus < 0.2:
            continue
        
        scored.append((total, r, name_score))
    
    if not scored:
        return None
    scored.sort(key=lambda x: -x[0])
    best = scored[0]
    if best[0] >= 0.4:
        return best[1]
    return None

def search_with_alternatives(name, series):
    """Try multiple search terms for a character."""
    # Clean name
    clean = re.sub(r'\s*\(.*?\)\s*', ' ', name).strip()
    clean = re.sub(r'\s*\(already\)', '', clean, flags=re.IGNORECASE).strip()
    
    # Series tokens for matching
    series_tokens = re.split(r'[^\w]+', series) if series else []
    
    searches = [clean]
    # Try removing parenthetical notes
    if clean != name:
        searches.append(clean)
    # Try just first name
    parts = clean.split()
    if len(parts) > 1:
        searches.append(parts[0])
    # Try last name first (Japanese order)
    if len(parts) > 1:
        searches.append(' '.join(parts[1:]))
    # Try with "female" removed
    f_clean = clean.lower().replace('female', '').replace('(f/n)', '').replace('(f)', '').strip()
    if f_clean and f_clean != clean.lower():
        searches.append(f_clean)
    
    for s in searches:
        if not s or len(s) < 2:
            continue
        results = api_search(s)
        if results:
            best = find_best_match(results, name, series_tokens)
            if best:
                return best
        time.sleep(0.5)
    return None

def main():
    # Load existing results
    try:
        with open('scripts/found_images.json') as f:
            existing_results = json.load(f)
    except:
        existing_results = {}
    
    print(f"Existing results: {len(existing_results)}")
    
    # Read characters.ts
    with open('lib/characters.ts', 'r') as f:
        content = f.read()
    
    # Find all character blocks
    pattern = re.compile(r'(  \{\n(?:.|\n)*?\n  \},?\n)', re.MULTILINE)
    char_blocks = list(pattern.finditer(content))
    
    # Parse character info
    missing = []  # (block_match, id, name, series)
    block_updates = []  # (old_block, new_block)
    
    for m in char_blocks:
        block = m.group(1)
        id_m = re.search(r'id: "(.+?)"', block)
        name_m = re.search(r'name: "(.+?)"', block)
        series_m = re.search(r'series: "(.+?)"', block)
        
        if not id_m or not name_m:
            continue
        
        cid = id_m.group(1)
        name = name_m.group(1)
        series = series_m.group(1) if series_m else ''
        
        if 'imageUrl:' not in block:
            missing.append((m, cid, name, series))
    
    print(f"Characters still missing imageUrl: {len(missing)}")
    
    # First pass: apply existing results
    new_image_count = 0
    retry_list = []
    
    for m, cid, name, series in missing:
        if cid in existing_results and cid not in ['shadow-cid-alter', 'pucci-enrico', 'lumine', 'klein', 'himeko-murata']:
            # Known good result - apply
            url = existing_results[cid]
            old_block = m.group(1)
            # Insert imageUrl before the closing brace
            new_block = old_block.rstrip()
            if new_block.endswith(','):
                new_block = new_block[:-1]
            # Find last newline before closing }
            lines = new_block.split('\n')
            for i in range(len(lines)-1, -1, -1):
                if lines[i].strip().startswith('}'):
                    indent = '  ' if not lines[i-1].startswith('  ') else lines[i-1][:len(lines[i-1])-len(lines[i-1].lstrip())]
                    lines.insert(i, f'{indent}  imageUrl: "{url}",')
                    break
            new_block = '\n'.join(lines) + '\n'
            block_updates.append((m.start(), m.end(), old_block, new_block))
            new_image_count += 1
        else:
            retry_list.append((m, cid, name, series))
    
    print(f"Applied {new_image_count} existing results")
    print(f"Need to retry/fix: {len(retry_list)}")
    
    # Apply the known-good updates to the file
    if block_updates:
        # Sort in reverse order by position to not mess up indices
        block_updates.sort(key=lambda x: -x[0])
        content_list = list(content)
        for start, end, old, new in block_updates:
            # Verify the content still matches
            if content[start:end] == old:
                content = content[:start] + new + content[end:]
            else:
                print(f"  WARNING: block mismatch at position {start}, skipping")
        
        with open('lib/characters.ts', 'w') as f:
            f.write(content)
        print("Updated characters.ts with known-good images!")
    
    # Second pass: retry failed ones with better search
    if retry_list:
        print(f"\n=== Second pass: {len(retry_list)} characters ===")
        second_pass_results = {}
        
        for idx, (m, cid, name, series) in enumerate(retry_list):
            print(f"[{idx+1}/{len(retry_list)}] {name} ({series})... ", end='', flush=True)
            
            # Skip duplicates (name has "already" in it)
            if 'already' in name.lower() or 'already' in series.lower():
                print("SKIP (duplicate)")
                continue
            
            best = search_with_alternatives(name, series)
            if best:
                url = best['image']['large']
                anilist_name = best['name']['full']
                media_names = [m['title']['romaji'] for m in best.get('media', {}).get('nodes', []) if m.get('title')]
                print(f"✓ {anilist_name} ({', '.join(media_names[:2])})")
                second_pass_results[cid] = url
            else:
                print(f"✗ No match")
                # List what we found
                time.sleep(0.5)
        
        # Save second pass results
        with open('scripts/second_pass_images.json', 'w') as f:
            json.dump(second_pass_results, f, indent=2)
        print(f"\nSecond pass found: {len(second_pass_results)}")
        
        # Apply them to the file
        if second_pass_results:
            # Re-read the file (it was updated above)
            with open('lib/characters.ts', 'r') as f:
                content = f.read()
            
            for m in pattern.finditer(content):
                block = m.group(1)
                id_m = re.search(r'id: "(.+?)"', block)
                if not id_m:
                    continue
                cid = id_m.group(1)
                if cid in second_pass_results and 'imageUrl:' not in block:
                    url = second_pass_results[cid]
                    lines = block.split('\n')
                    for i in range(len(lines)-1, -1, -1):
                        if lines[i].strip().startswith('}'):
                            indent = lines[i-1][:len(lines[i-1])-len(lines[i-1].lstrip())] if i > 0 else '  '
                            indent += '  '
                            lines.insert(i, f'{indent}imageUrl: "{url}",')
                            break
                    new_block = '\n'.join(lines)
                    content = content.replace(block, new_block, 1)
            
            with open('lib/characters.ts', 'w') as f:
                f.write(content)
            print("Applied second-pass images to characters.ts!")
    
    # Final count
    with open('lib/characters.ts', 'r') as f:
        final_content = f.read()
    
    total = 0
    with_img = 0
    for m in pattern.finditer(final_content):
        total += 1
        if 'imageUrl:' in m.group(1):
            with_img += 1
    
    print(f"\n=== FINAL ===")
    print(f"Total characters: {total}")
    print(f"With imageUrl: {with_img}")
    print(f"Still missing: {total - with_img}")

if __name__ == '__main__':
    main()
