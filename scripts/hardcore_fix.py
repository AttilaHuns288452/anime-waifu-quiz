#!/usr/bin/env python3
"""
Hardcore fix for wrong character matches.
Uses media-first approach: find the series, then find the character within it.
"""
import json, re, time, urllib.request, urllib.error
from difflib import SequenceMatcher

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
API_URL = 'https://graphql.anilist.co'

# Characters that still have WRONG images
# (character_id, correct_name_on_anilist_or_search_hint)
WRONG = {
    "historia-reiss": {"hint": "Historia", "media": "Shingeki no Kyojin"},
    "lady-nagant": {"hint": "Kaina Tsutsumi", "media": "Boku no Hero Academia"},
    "himeko-murata": {"hint": "Himeko", "media": "Honkai Impact 3rd"},
    "raiden-mei": {"hint": "Raiden Mei", "media": "Honkai Impact 3rd"},
    "lumine": {"hint": "Lumine", "media": "Genshin Impact"},
    "anri-yoshioka": {"hint": "Anri Yoshioka", "media": "Romantic Killer"},
    "ryo-mukohara": {"hint": "Ryo Mukohara", "media": "Romantic Killer"},
    "kyotaro-ichikawa": {"hint": "Kyotaro Ichikawa", "media": "Boku no Kokoro"},
    "yuji-itadori": {"hint": "Yuji Itadori", "media": "Jujutsu Kaisen"},
    "obito-uchiha": {"hint": "Obito Uchiha", "media": "Naruto"},
    "toshiro-hitsugaya": {"hint": "Toshiro Hitsugaya", "media": "Bleach"},
    "aizen-sosuke": {"hint": "Sosuke Aizen", "media": "Bleach"},
    "sasaki-haise": {"hint": "Sasaki Haise", "media": "Tokyo Ghoul"},
    "sesshouin-kiara": {"hint": "Sesshouin Kiara", "media": "Fate/Extra"},
}

def api(query, variables):
    payload = json.dumps({'query': query, 'variables': variables}).encode('utf-8')
    for attempt in range(3):
        try:
            req = urllib.request.Request(API_URL, data=payload, headers={
                'Content-Type': 'application/json', 'Accept': 'application/json',
                'User-Agent': USER_AGENT
            })
            resp = urllib.request.urlopen(req, timeout=15)
            return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                print(f"  Rate limited, waiting {5*(attempt+1)}s...")
                time.sleep(5 * (attempt + 1))
            else:
                return None
        except:
            return None
    return None

MEDIA_CHAR_QUERY = '''
query ($media: String) {
  Media(search: $media, type: ANIME) {
    id
    title { romaji }
    characters(page: 1, perPage: 50) {
      nodes {
        id
        name { full }
        image { large }
      }
    }
  }
}
'''

def find_character_in_media(media_name, char_name_hint):
    """Search for character within a specific anime media."""
    result = api(MEDIA_CHAR_QUERY, {"media": media_name})
    if not result:
        return None
    media = result.get('data', {}).get('Media')
    if not media:
        return None
    
    chars = media.get('characters', {}).get('nodes', [])
    hint_lower = char_name_hint.lower()
    
    # Best match: character name contains the hint
    for c in chars:
        nm = c['name']['full'].lower()
        if hint_lower in nm or SequenceMatcher(None, hint_lower, nm).ratio() > 0.7:
            return c
    
    # Fuzzy match
    best_score = 0
    best_char = None
    for c in chars:
        nm = c['name']['full'].lower()
        score = SequenceMatcher(None, hint_lower, nm).ratio()
        if score > best_score:
            best_score = score
            best_char = c
    
    if best_score > 0.4:
        print(f"    fuzzy match {best_char['name']['full']} (score={best_score:.2f})")
        return best_char
    
    return None

def search_multi(hints):
    """Try multiple search terms."""
    SEARCH_QUERY = '''
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
    for hint in hints:
        result = api(SEARCH_QUERY, {"search": hint})
        if not result:
            continue
        chars = result.get('data', {}).get('Page', {}).get('characters', [])
        if chars:
            return chars
        time.sleep(0.7)
    return []

def main():
    found = {}
    
    for cid, info in WRONG.items():
        print(f"\n=== {cid}: {info['hint']} in {info['media']} ===", flush=True)
        
        # Strategy 1: Media-first search
        char = find_character_in_media(info['media'], info['hint'])
        if char:
            print(f"  ✓ Media match: {char['name']['full']}")
            found[cid] = char['image']['large']
            time.sleep(0.7)
            continue
        
        # Strategy 2: Search with character + series name
        hints = [
            f"{info['hint']}",
            f"{info['hint']} {info['media']}",
        ]
        results = search_multi(hints)
        for c in results:
            mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
            mt_str = ' '.join(mt).lower()
            media_key = info['media'].lower()[:5]
            if media_key in mt_str:
                print(f"  ✓ Search+media match: {c['name']['full']} [{' '.join(mt[:2])}]")
                found[cid] = c['image']['large']
                break
            # Also check if name matches
            if SequenceMatcher(None, info['hint'].lower(), c['name']['full'].lower()).ratio() > 0.7:
                print(f"  ✓ Name match: {c['name']['full']}")
                found[cid] = c['image']['large']
                break
        else:
            # Show what we got
            for c in results:
                mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
                print(f"    got: {c['name']['full']:30s} [{', '.join(mt[:2]):50s}]")
            print(f"  ✗ Could not find correct match for {info['hint']}")
    
    # Read and update characters.ts
    with open('lib/characters.ts', 'r') as f:
        content = f.read()
    
    pattern = re.compile(r'(  \{\n(?:.|\n)*?\n  \},?\n)', re.MULTILINE)
    updates = 0
    
    for m in pattern.finditer(content):
        block = m.group(1)
        id_m = re.search(r'id: "(.+?)"', block)
        if not id_m:
            continue
        cid = id_m.group(1)
        
        if cid in found:
            url = found[cid]
            old_img = re.search(r'  imageUrl: "(.+?)",?', block)
            if old_img:
                new_block = block.replace(old_img.group(0), f'  imageUrl: "{url}",')
                content = content.replace(block, new_block, 1)
                updates += 1
                print(f"  Updated {cid} in file")
    
    if updates > 0:
        with open('lib/characters.ts', 'w') as f:
            f.write(content)
        print(f"\n✓ Applied {updates} fixes!")
    
    # Final check
    total = 0
    with_img = 0
    for m in pattern.finditer(content):
        total += 1
        if 'imageUrl:' in m.group(1):
            with_img += 1
    print(f"\nTotal: {total}, With images: {with_img}")

if __name__ == '__main__':
    main()
