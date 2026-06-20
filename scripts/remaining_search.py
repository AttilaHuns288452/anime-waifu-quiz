#!/usr/bin/env python3
"""
Final fix for remaining characters.
"""
import json, re, time, urllib.request, urllib.error

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
API_URL = 'https://graphql.anilist.co'

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

# Find character in a specific anime media
MEDIA_CHAR_QUERY = '''
query ($media: String) {
  Media(search: $media, type: ANIME) {
    title { romaji english }
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

found_urls = {}

# 1. Shunsui Kyoraku - search the entire Bleach media character list
print("\n=== Shunsui Kyoraku ===")
for media_name in ["Bleach", "BLEACH"]:
    result = api(MEDIA_CHAR_QUERY, {"media": media_name})
    if result:
        chars = result.get('data', {}).get('Media', {}).get('characters', {}).get('nodes', [])
        for c in chars:
            nm = c['name']['full'].lower()
            if 'shunsui' in nm or 'kyoraku' in nm or 'kyouraku' in nm:
                print(f"Found: {c['name']['full']}")
                found_urls["shunsui-kyoraku"] = c['image']['large']
                break
        else:
            print(f"No match in {len(chars)} Bleach characters")
            # Print some char names for debugging
            for c in chars[:10]:
                print(f"  {c['name']['full']}")
        time.sleep(1)
    break

# 2. Toshiro Hitsugaya - Bleach media
print("\n=== Toshiro Hitsugaya ===")
result = api(MEDIA_CHAR_QUERY, {"media": "Bleach"})
time.sleep(1)
if result:
    chars = result.get('data', {}).get('Media', {}).get('characters', {}).get('nodes', [])
    for c in chars:
        nm = c['name']['full'].lower()
        if 'toshiro' in nm or 'hitsugaya' in nm or 'toushirou' in nm:
            print(f"Found: {c['name']['full']}")
            found_urls["toshiro-hitsugaya"] = c['image']['large']
            break
    else:
        print("Not found in first 50 Bleach chars")

# 3. Aizen Sosuke - Bleach media
print("\n=== Aizen Sosuke ===")
# Try different search
SINGLE_QUERY = '''
query ($search: String) {
  Page(page: 1, perPage: 10) {
    characters(search: $search) {
      id
      name { full }
      image { large }
      media(page: 1, perPage: 3) {
        nodes { title { romaji english } }
      }
    }
  }
}
'''
result = api(SINGLE_QUERY, {"search": "Aizen"})
time.sleep(1)
if result:
    chars = result.get('data', {}).get('Page', {}).get('characters', [])
    for c in chars:
        mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
        mt_str = ' '.join(mt).lower()
        if 'bleach' in mt_str:
            print(f"Found: {c['name']['full']} ({', '.join(mt[:2])})")
            found_urls["aizen-sosuke"] = c['image']['large']
            break
    else:
        print(f"Not found. Got: {[c['name']['full'] for c in chars]}")

# 4. Obito Uchiha
print("\n=== Obito Uchiha ===")
result = api(SINGLE_QUERY, {"search": "Obito"})
time.sleep(1)
if result:
    chars = result.get('data', {}).get('Page', {}).get('characters', [])
    for c in chars:
        mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
        mt_str = ' '.join(mt).lower()
        if 'naruto' in mt_str or 'shippuden' in mt_str:
            print(f"Found: {c['name']['full']}")
            found_urls["obito-uchiha"] = c['image']['large']
            break
    else:
        print(f"Not found. Got: {[c['name']['full'] for c in chars]}")

# 5. Historia Reiss
print("\n=== Historia Reiss ===")
for s in ["Historia", "Historia Reiss"]:
    result = api(SINGLE_QUERY, {"search": s})
    time.sleep(1)
    if result:
        chars = result.get('data', {}).get('Page', {}).get('characters', [])
        for c in chars:
            mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
            mt_str = ' '.join(mt).lower()
            if 'shingeki' in mt_str or 'attack' in mt_str or 'aot' in mt_str:
                print(f"Found: {c['name']['full']}")
                found_urls["historia-reiss"] = c['image']['large']
                break
        else:
            names = [f"{c['name']['full']} ({c['image']['large'][:30]}...)" for c in chars]
            print(f"No match for '{s}'. Got: {names}")

# 6. Garfield Tinsel (Re:Zero) - correct name is "Garfiel Tinsel"
print("\n=== Garfield Tinsel ===")
for s in ["Garfiel Re:Zero", "Garfiel Tinsel"]:
    result = api(SINGLE_QUERY, {"search": s})
    time.sleep(1)
    if result:
        chars = result.get('data', {}).get('Page', {}).get('characters', [])
        for c in chars:
            mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
            mt_str = ' '.join(mt).lower()
            if 're:zero' in mt_str or 're zero' in mt_str:
                print(f"Found: {c['name']['full']}")
                found_urls["garfield-tinsel"] = c['image']['large']
                break
        else:
            print(f"No match for '{s}'")

# 7. Shogo Makishima
print("\n=== Shogo Makishima ===")
for s in ["Makishima"]:
    result = api(SINGLE_QUERY, {"search": s})
    time.sleep(1)
    if result:
        chars = result.get('data', {}).get('Page', {}).get('characters', [])
        for c in chars:
            mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
            mt_str = ' '.join(mt).lower()
            if 'psycho' in mt_str or 'pass' in mt_str:
                print(f"Found: {c['name']['full']}")
                found_urls["shogo-makishima"] = c['image']['large']
                break
        else:
            print(f"No match. Got: {[c['name']['full'] for c in chars]}")

# 8. Sasaki Haise
print("\n=== Sasaki Haise ===")
for s in ["Haise Sasaki", "Sasaki Haise"]:
    result = api(SINGLE_QUERY, {"search": s})
    time.sleep(1)
    if result:
        chars = result.get('data', {}).get('Page', {}).get('characters', [])
        for c in chars:
            mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
            mt_str = ' '.join(mt).lower()
            if 'tokyo' in mt_str or 'ghoul' in mt_str:
                print(f"Found: {c['name']['full']}")
                found_urls["sasaki-haise"] = c['image']['large']
                break
        else:
            print(f"No match for '{s}'")

# 9. Himeko Murata - correct search
print("\n=== Himeko Murata ===")
for s in ["Himeko", "Murata Himeko"]:
    result = api(SINGLE_QUERY, {"search": s})
    time.sleep(1)
    if result:
        chars = result.get('data', {}).get('Page', {}).get('characters', [])
        for c in chars:
            mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
            mt_str = ' '.join(mt).lower()
            if 'honkai' in mt_str or 'benghuai' in mt_str or 'honkai impact' in mt_str or 'valkyrie' in mt_str:
                print(f"Found: {c['name']['full']}")
                found_urls["himeko-murata"] = c['image']['large']
                break
        else:
            print(f"No match for '{s}'")

# 10. Kyotaro Ichikawa
print("\n=== Kyotaro Ichikawa ===")
for s in ["Ichikawa Kyotaro", "Kyotaro Ichikawa"]:
    result = api(SINGLE_QUERY, {"search": s})
    time.sleep(1)
    if result:
        chars = result.get('data', {}).get('Page', {}).get('characters', [])
        for c in chars:
            print(f"  {c['name']['full']}")

# 11. Nagataro Hayase
print("\n=== Nagataro Hayase ===")
for s in ["Nagatoro", "Hayase Nagatoro"]:
    result = api(SINGLE_QUERY, {"search": s})
    time.sleep(1)
    if result:
        chars = result.get('data', {}).get('Page', {}).get('characters', [])
        for c in chars:
            mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
            mt_str = ' '.join(mt).lower()
            if 'nagatoro' in mt_str or 'ijiranaide' in mt_str:
                print(f"Found: {c['name']['full']}")
                found_urls["nagataro-hayase"] = c['image']['large']
                break
        else:
            print(f"No match")

# 12. Romantic Killer characters
print("\n=== Romantic Killer ===")
result = api(MEDIA_CHAR_QUERY, {"media": "Romantic Killer"})
time.sleep(1)
if result:
    chars = result.get('data', {}).get('Media', {}).get('characters', {}).get('nodes', [])
    for c in chars:
        nm = c['name']['full'].lower()
        print(f"  {c['name']['full']}")
        if 'anri' in nm or 'yoshioka' in nm:
            found_urls["anri-yoshioka"] = c['image']['large']
        if 'ryo' in nm or 'mukohara' in nm:
            found_urls["ryo-mukohara"] = c['image']['large']

# 13. Sesshouin Kiara (Fate/Extra)
print("\n=== Sesshouin Kiara ===")
result = api(MEDIA_CHAR_QUERY, {"media": "Fate/Extra"})
time.sleep(1)
if result:
    chars = result.get('data', {}).get('Media', {}).get('characters', {}).get('nodes', [])
    for c in chars:
        nm = c['name']['full'].lower()
        if 'kiara' in nm or 'sesshouin' in nm:
            print(f"Found: {c['name']['full']}")
            found_urls["sesshouin-kiara"] = c['image']['large']
            break
    else:
        print(f"Not found in Fate/Extra. Got: {[c['name']['full'] for c in chars[:20]]}")

# 14. Genshin characters - search by Chinese/English names
print("\n=== Genshin ===")
genshin_map = {
    "yae-miko": ["Yae","Miko"],
    "raiden-shogun": ["Shogun","Raiden","Ei"],
    "clorinde": ["Clorinde"],
    "nilou": ["Nilou"],
}
# Try searching in Genshin media
result = api(MEDIA_CHAR_QUERY, {"media": "Genshin Impact"})
time.sleep(1)
if result:
    chars = result.get('data', {}).get('Media', {}).get('characters', {}).get('nodes', [])
    for c in chars:
        nm = c['name']['full'].lower()
        for cid, keywords in genshin_map.items():
            for kw in keywords:
                if kw.lower() in nm:
                    if cid not in found_urls:
                        print(f"Found {cid}: {c['name']['full']}")
                        found_urls[cid] = c['image']['large']

# For Genshin characters still missing, try individual search
for cid, keywords in genshin_map.items():
    if cid not in found_urls:
        for kw in keywords:
            result = api(SINGLE_QUERY, {"search": kw})
            time.sleep(1)
            if result:
                chars = result.get('data', {}).get('Page', {}).get('characters', [])
                for c in chars:
                    mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
                    mt_str = ' '.join(mt).lower()
                    if 'genshin' in mt_str or 'yuanshen' in mt_str:
                        print(f"Found {cid}: {c['name']['full']}")
                        found_urls[cid] = c['image']['large']
                        break
                if cid in found_urls:
                    break

# Save what we found
print(f"\n=== Found URLs ===")
for k, v in found_urls.items():
    print(f"  {k}: {v[:60]}...")

with open('scripts/remaining_images.json', 'w') as f:
    json.dump(found_urls, f, indent=2)
print(f"\nSaved {len(found_urls)} URLs")
