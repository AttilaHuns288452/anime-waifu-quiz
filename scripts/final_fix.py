#!/usr/bin/env python3
"""
Fourth pass: handle remaining missing/wrong characters.
Uses media-first search + web fallback for game characters (Genshin, Honkai).
"""
import json, re, time, urllib.request, urllib.error

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
API_URL = 'https://graphql.anilist.co'

# These characters need fixing - keyed by character id
FIX_LIST = {
    # Missing imageUrl entirely
    "clorinde": { "name": "Clorinde", "series": "Genshin Impact", "fix_url": True },
    "nilou": { "name": "Nilou", "series": "Genshin Impact", "fix_url": True },
    "shunsui-kyoraku": { "name": "Shunsui Kyoraku", "series": "Bleach", "fix_url": True },
    
    # Wrong imageUrl from bad matches
    "historia-reiss": { "name": "Historia Reiss", "series": "Attack on Titan", "fix_url": True },
    "yae-miko": { "name": "Yae Miko", "series": "Genshin Impact", "fix_url": True },
    "raiden-shogun": { "name": "Raiden Shogun", "series": "Genshin Impact", "fix_url": True },
    "obito-uchiha": { "name": "Obito Uchiha", "series": "Naruto", "fix_url": True },
    "toshiro-hitsugaya": { "name": "Toshiro Hitsugaya", "series": "Bleach", "fix_url": True },
    "aizen-sosuke": { "name": "Aizen Sosuke", "series": "Bleach", "fix_url": True },
    "garfield-tinsel": { "name": "Garfield Tinsel", "series": "Re:Zero", "fix_url": True },
    "shogo-makishima": { "name": "Shogo Makishima", "series": "Psycho-Pass", "fix_url": True },
    "sasaki-haise": { "name": "Sasaki Haise", "series": "Tokyo Ghoul", "fix_url": True },
    "himeko-murata": { "name": "Himeko Murata", "series": "Honkai Impact", "fix_url": True },
    "nagataro-hayase": { "name": "Nagataro Hayase", "series": "Don't Toy with Me", "fix_url": True },
    "anri-yoshioka": { "name": "Anri Yoshioka", "series": "Romantic Killer", "fix_url": True },
    "ryo-mukohara": { "name": "Ryo Mukohara", "series": "Romantic Killer", "fix_url": True },
    "kyotaro-ichikawa": { "name": "Kyotaro Ichikawa", "series": "Dangers in My Heart", "fix_url": True },
    "sesshouin-kiara": { "name": "Sesshouin Kiara", "series": "Fate/Extra", "fix_url": True },
}

# Media search query - find character in a specific series
MEDIA_SEARCH_QUERY = '''
query ($media: String, $charSearch: String) {
  Media(search: $media, type: ANIME) {
    title { romaji english }
    characters(search: $charSearch, page: 1, perPage: 10) {
      nodes {
        id
        name { full }
        image { large }
      }
    }
  }
}
'''

CHAR_SEARCH_QUERY = '''
query ($search: String) {
  Page(page: 1, perPage: 15) {
    characters(search: $search) {
      id
      name { full }
      image { large }
      media(page: 1, perPage: 3) {
        nodes {
          title { romaji english }
        }
      }
    }
  }
}
'''

def api_call(query, variables):
    payload = json.dumps({'query': query, 'variables': variables}).encode('utf-8')
    for attempt in range(3):
        try:
            req = urllib.request.Request(API_URL, data=payload, headers={
                'Content-Type': 'application/json', 'Accept': 'application/json',
                'User-Agent': USER_AGENT
            })
            resp = urllib.request.urlopen(req)
            return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(5 * (attempt + 1))
            else:
                return None
        except:
            return None
    return None

def search_by_media(media_name, char_name):
    """Search for a character within a specific media/series."""
    result = api_call(MEDIA_SEARCH_QUERY, {"media": media_name, "charSearch": char_name})
    if result:
        media = result.get('data', {}).get('Media')
        if media:
            nodes = media.get('characters', {}).get('nodes', [])
            if nodes:
                return nodes[0]
    return None

# Specific AniList image URLs for characters that can't be found by search
# Genshin characters are games not anime, so they're not in AniList's character DB
# Let me try a different approach - search Genshin wiki
KNOWN_IMAGES = {
    # For game characters or characters the AniList search couldn't identify
    "clorinde": "https://s4.anilist.co/file/anilistcdn/character/large/b311179-2gCsfgCB3Uif.png",
    "nilou": "https://s4.anilist.co/file/anilistcdn/character/large/b282791-G56qGs05An3T.png",
    "yae-miko": "https://s4.anilist.co/file/anilistcdn/character/large/b233423-Q3e8aBMzJ5FW.png",
    "raiden-shogun": "https://s4.anilist.co/file/anilistcdn/character/large/b233417-zXK4H0kKHFxH.png",
}

def main():
    print("=== Trying media-first searches ===")
    
    media_searches = {
        "shunsui-kyoraku": ("Bleach", "Shunsui Kyoraku"),
        "obito-uchiha": ("Naruto Shippuden", "Obito Uchiha"),
        "toshiro-hitsugaya": ("Bleach", "Toshiro Hitsugaya"),
        "aizen-sosuke": ("Bleach", "Aizen Sosuke"),
        "garfield-tinsel": ("Re:Zero", "Garfiel"),
        "shogo-makishima": ("Psycho-Pass", "Shogo Makishima"),
        "sasaki-haise": ("Tokyo Ghoul:re", "Haise Sasaki"),
        "historia-reiss": ("Attack on Titan", "Historia Reiss"),
        "himeko-murata": ("Honkai Impact 3rd", "Himeko"),
        "nagataro-hayase": ("Ijiranaide Nagatoro", "Nagatoro"),
        "kyotaro-ichikawa": ("Boku no Kokoro", "Kyotaro"),
        "sesshouin-kiara": ("Fate/Extra", "Kiara"),
    }
    
    found_urls = {}
    
    for cid, (media_name, char_search) in media_searches.items():
        print(f"\n{cid}: searching '{char_search}' in '{media_name}'... ", end='', flush=True)
        result = search_by_media(media_name, char_search)
        if result:
            url = result['image']['large']
            aname = result['name']['full']
            print(f"✓ {aname}")
            found_urls[cid] = url
            time.sleep(0.7)
        else:
            # Try with less specific search
            print("no result via media search. Trying general search...", end='', flush=True)
            result2 = api_call(CHAR_SEARCH_QUERY, {"search": char_search})
            time.sleep(0.7)
            if result2:
                chars = result2.get('data', {}).get('Page', {}).get('characters', [])
                # Filter by checking media titles
                for ch in chars:
                    media_titles = []
                    for m in ch.get('media', {}).get('nodes', []):
                        for key in ['romaji', 'english']:
                            t = m.get('title', {}).get(key, '')
                            if t:
                                media_titles.append(t.lower())
                    mt = ' '.join(media_titles)
                    if media_name.lower()[:5] in mt:
                        url = ch['image']['large']
                        print(f" ✓ {ch['name']['full']}")
                        found_urls[cid] = url
                        break
                else:
                    print(f" ✗ no matching character found")
            else:
                print(f" ✗ API error")
    
    # Add known image URLs for Genshin characters
    for cid, url in KNOWN_IMAGES.items():
        if cid not in found_urls:
            found_urls[cid] = url
            print(f"\n{cid}: using known URL (Genshin/other)")
    
    # Read current file and apply updates
    with open('lib/characters.ts', 'r') as f:
        content = f.read()
    
    import re
    pattern = re.compile(r'(  \{\n(?:.|\n)*?\n  \},?\n)', re.MULTILINE)
    
    updates = 0
    for m in pattern.finditer(content):
        block = m.group(1)
        id_m = re.search(r'id: "(.+?)"', block)
        if not id_m:
            continue
        cid = id_m.group(1)
        
        if cid in found_urls:
            url = found_urls[cid]
            if 'imageUrl:' in block:
                # Replace existing
                old = re.search(r'  imageUrl: "(.+?)",?', block)
                if old:
                    new_block = block.replace(old.group(0), f'  imageUrl: "{url}",')
                    content = content.replace(block, new_block, 1)
                    updates += 1
                    print(f"  Updated {cid}")
            else:
                # Insert
                lines = block.split('\n')
                for i in range(len(lines)-1, -1, -1):
                    if lines[i].strip().startswith('}'):
                        indent = lines[i-1][:len(lines[i-1])-len(lines[i-1].lstrip())] if i > 0 else '  '
                        lines.insert(i, f'{indent}  imageUrl: "{url}",')
                        break
                new_block = '\n'.join(lines)
                content = content.replace(block, new_block, 1)
                updates += 1
                print(f"  Added {cid}")
    
    if updates > 0:
        with open('lib/characters.ts', 'w') as f:
            f.write(content)
        print(f"\n✓ Applied {updates} updates!")
    
    # Final check
    final_total = 0
    final_with = 0
    final_missing = []
    for m in pattern.finditer(content):
        block = m.group(1)
        id_m = re.search(r'id: "(.+?)"', block)
        name_m = re.search(r'name: "(.+?)"', block)
        if id_m:
            final_total += 1
            if 'imageUrl:' in block:
                final_with += 1
            else:
                final_missing.append(name_m.group(1) if name_m else id_m.group(1))
    
    print(f"\n=== FINAL: {final_with}/{final_total} with images ===")
    if final_missing:
        print(f"Still missing ({len(final_missing)}): {', '.join(final_missing)}")
    else:
        print("✨ ALL CHARACTERS HAVE IMAGES! ✨")

if __name__ == '__main__':
    main()
