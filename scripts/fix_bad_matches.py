#!/usr/bin/env python3
"""
Third pass: fix WRONG matches and find the 3 still-missing characters.
"""
import json, re, time, urllib.request, urllib.error
from difflib import SequenceMatcher

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
API_URL = 'https://graphql.anilist.co'

QUERY_WITH_MEDIA = '''
query ($search: String) {
  Page(page: 1, perPage: 10) {
    characters(search: $search) {
      id
      name { full }
      image { large }
      media(page: 1, perPage: 5) {
        nodes { title { romaji english } }
      }
    }
  }
}
'''

def api_search(search_term, query=QUERY_WITH_MEDIA):
    payload = json.dumps({'query': query, 'variables': {'search': search_term, 'page': 1}}).encode('utf-8')
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
                time.sleep(5 * (attempt + 1))
            else:
                return []
        except:
            return []
    return []

# Specific bad matches that need fixing
# (character_id, expected_series_tokens)
BAD_MATCHES = {
    # Wrong matches to fix
    "historia-reiss": ["Attack on Titan", "Shingeki", "AOT"],
    "lady-nagant": ["My Hero Academia", "Boku no Hero", "MHA"],
    "yae-miko": ["Genshin Impact", "Genshin"],
    "lumine": ["Genshin Impact", "Genshin"],
    "anri-yoshioka": ["Romantic Killer"],
    "ryo-mukohara": ["Romantic Killer"],
    "kyotaro-ichikawa": ["Dangers in My Heart", "Boku no Kokoro"],
    "yuji-itadori": ["Jujutsu Kaisen", "JJK"],
    "pucci-enrico": ["JoJo", "Stone Ocean"],
    "shadow-cid-alter": ["Eminence in Shadow", "Kage no Jitsuryokusha"],
    "obito-uchiha": ["Naruto", "Naruto Shippuden"],
    "toshiro-hitsugaya": ["Bleach"],
    "aizen-sosuke": ["Bleach"],
    "garfield-tinsel": ["Re:Zero"],
    "shogo-makishima": ["Psycho-Pass", "PSYCHO-PASS"],
    "sasaki-haise": ["Tokyo Ghoul"],
    "klein": ["Sword Art Online", "SAO"],
    "sesshouin-kiara": ["Fate", "Fate/Extra"],
    "himeko-murata": ["Honkai Impact", "Honkai"],
    "raiden-shogun": ["Genshin Impact", "Genshin"],
    "nagataro-hayase": ["Don't Toy with Me", "Nagatoro", "Ijiranaide"],
}

def find_match_for_series(results, series_tokens):
    """Find a result that belongs to the expected series."""
    for r in results:
        media_titles = []
        for m in r.get('media', {}).get('nodes', []):
            for key in ['romaji', 'english']:
                t = m.get('title', {}).get(key, '')
                if t:
                    media_titles.append(t.lower())
        media_text = ' '.join(media_titles)
        
        for tok in series_tokens:
            if tok.lower() in media_text:
                return r
    return None

def main():
    # Read current characters.ts
    with open('lib/characters.ts', 'r') as f:
        content = f.read()
    
    pattern = re.compile(r'(  \{\n(?:.|\n)*?\n  \},?\n)', re.MULTILINE)
    
    updates = 0
    for cid, series_tokens in BAD_MATCHES.items():
        print(f"\n=== {cid} ===", flush=True)
        
        # Find this character's block
        for m in pattern.finditer(content):
            block = m.group(1)
            if f'id: "{cid}"' in block:
                name_m = re.search(r'name: "(.+?)"', block)
                name = name_m.group(1) if name_m else cid
                
                # Try different search terms
                search_terms = [
                    name,
                    f"{name} {series_tokens[0]}",
                    re.sub(r'\s*\(.*?\)\s*', ' ', name).strip(),
                    series_tokens[0] + " " + name.split()[0] if name.split() else name,
                    " ".join(series_tokens[:2]) + " " + name.split()[0] if name.split() else name,
                ]
                
                found = False
                for term in search_terms:
                    if len(term) < 3:
                        continue
                    print(f"  Trying: '{term}'... ", end='', flush=True)
                    results = api_search(term)
                    if results:
                        match = find_match_for_series(results, series_tokens[:3])
                        if match:
                            url = match['image']['large']
                            aname = match['name']['full']
                            print(f"✓ {aname}")
                            
                            # Replace imageUrl in block
                            old_img = re.search(r'  imageUrl: "(.+?)",?', block)
                            if old_img:
                                new_block = block.replace(old_img.group(0), f'  imageUrl: "{url}",')
                            else:
                                # Insert before closing }
                                lines = block.split('\n')
                                for i in range(len(lines)-1, -1, -1):
                                    if lines[i].strip().startswith('}'):
                                        indent = lines[i-1][:len(lines[i-1])-len(lines[i-1].lstrip())] if i > 0 else '  '
                                        lines.insert(i, f'{indent}  imageUrl: "{url}",')
                                        break
                                new_block = '\n'.join(lines)
                            
                            content = content.replace(block, new_block, 1)
                            updates += 1
                            found = True
                            break
                        else:
                            # Show what we got but didn't match
                            for r in results[:3]:
                                mt = [m['title'].get('romaji','') for m in r.get('media',{}).get('nodes',[]) if m.get('title')]
                                print(f"  got {r['name']['full']} ({', '.join(mt[:2])})")
                    else:
                        print(f"no results")
                    time.sleep(0.7)
                
                if not found:
                    print(f"  ✗ Still couldn't find correct match for {name}")
                break
    
    if updates > 0:
        with open('lib/characters.ts', 'w') as f:
            f.write(content)
        print(f"\nFixed {updates} bad matches!")
    
    # Also try the 3 missing ones
    print("\n\n=== Missing characters ===")
    for m in pattern.finditer(content):
        block = m.group(1)
        if 'imageUrl:' not in block:
            id_m = re.search(r'id: "(.+?)"', block)
            name_m = re.search(r'name: "(.+?)"', block)
            if id_m and name_m:
                print(f"\nMissing: {name_m.group(1)} (id={id_m.group(1)})")
    
    # Final count
    total = 0
    with_img = 0
    for m in pattern.finditer(content):
        total += 1
        if 'imageUrl:' in m.group(1):
            with_img += 1
    print(f"\n=== FINAL: {with_img}/{total} with images ===")

if __name__ == '__main__':
    main()
