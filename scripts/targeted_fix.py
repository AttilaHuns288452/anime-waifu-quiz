#!/usr/bin/env python3
"""
Targeted fixes for remaining wrong matches.
"""
import json, re, time, urllib.request, urllib.error
from difflib import SequenceMatcher

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

# Direct character lookup by name + media verification
SEARCH_QUERY = '''
query ($search: String) {
  Page(page: 1, perPage: 15) {
    characters(search: $search) {
      id
      name { full }
      image { large }
      media(page: 1, perPage: 5) {
        nodes { title { romaji } }
      }
    }
  }
}
'''

# Character ID lookup
ID_QUERY = '''
query ($id: Int) {
  Character(id: $id) {
    id
    name { full }
    image { large }
    media(page: 1, perPage: 3) {
      nodes { title { romaji } }
    }
  }
}
'''

# Media character list (multi-page)
MEDIA_CHARS_QUERY = '''
query ($media: String, $page: Int) {
  Media(search: $media, type: ANIME) {
    id
    characters(page: $page, perPage: 50) {
      nodes {
        id
        name { full }
        image { large }
      }
      pageInfo {
        hasNextPage
        total
      }
    }
  }
}
'''

def find_char_in_media_pages(media_name, char_name, max_pages=3):
    """Search through multiple pages of a media's character list."""
    for page in range(1, max_pages + 1):
        result = api(MEDIA_CHARS_QUERY, {"media": media_name, "page": page})
        if not result:
            return None
        media = result.get('data', {}).get('Media')
        if not media:
            return None
        chars = media.get('characters', {}).get('nodes', [])
        has_next = media.get('characters', {}).get('pageInfo', {}).get('hasNextPage', False)
        
        for c in chars:
            nm = c['name']['full'].lower()
            cn = char_name.lower()
            if cn in nm or SequenceMatcher(None, cn, nm).ratio() > 0.85:
                return c
        
        if not has_next:
            break
        time.sleep(0.5)
    return None

found = {}

# 1. Lady Nagant (Kaina Tsutsumi) - search MHA character list deeply
print("=== Lady Nagant ===")
# Try direct search for Kaina Tsutsumi
result = api(SEARCH_QUERY, {"search": "Kaina Tsutsumi"})
time.sleep(0.7)
if result:
    chars = result.get('data', {}).get('Page', {}).get('characters', [])
    for c in chars:
        mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
        mt_str = ' '.join(mt).lower()
        if 'hero' in mt_str or 'boku' in mt_str:
            print(f"  Found: {c['name']['full']}")
            found['lady-nagant'] = c['image']['large']
            break
    else:
        print(f"  Got: {[c['name']['full'] for c in chars]}")

# 2. Obito Uchiha - search within Naruto with page iteration
if 'obito-uchiha' not in found:
    print("\n=== Obito Uchiha ===")
    char = find_char_in_media_pages("Naruto Shippuden", "Obito Uchiha", 5)
    if char:
        print(f"  Found: {char['name']['full']}")
        found['obito-uchiha'] = char['image']['large']
    else:
        # Try general search
        result = api(SEARCH_QUERY, {"search": "Obito Uchiha"})
        time.sleep(0.7)
        if result:
            chars = result.get('data', {}).get('Page', {}).get('characters', [])
            for c in chars:
                mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
                mt_str = ' '.join(mt).lower()
                if 'naruto' in mt_str or 'shippuden' in mt_str:
                    print(f"  Found: {c['name']['full']}")
                    found['obito-uchiha'] = c['image']['large']
                    break
            else:
                print(f"  Got: {[c['name']['full'] for c in chars]}")

# 3. Sasaki Haise - look up Tokyo Ghoul character list
if 'sasaki-haise' not in found:
    print("\n=== Sasaki Haise ===")
    # Try searching from Tokyo Ghoul:re media
    char = find_char_in_media_pages("Tokyo Ghoul:re", "Haise", 3)
    if char:
        print(f"  Found: {char['name']['full']}")
        found['sasaki-haise'] = char['image']['large']
    else:
        # Try general search
        result = api(SEARCH_QUERY, {"search": "Sasaki Haise"})
        time.sleep(0.7)
        if result:
            chars = result.get('data', {}).get('Page', {}).get('characters', [])
            for c in chars:
                mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
                mt_str = ' '.join(mt).lower()
                if 'tokyo' in mt_str or 'ghoul' in mt_str:
                    print(f"  Found: {c['name']['full']}")
                    found['sasaki-haise'] = c['image']['large']
                    break
            else:
                print(f"  Got: {[c['name']['full'] for c in chars]}")

# 4. Lumine - fix back to Genshin portrait
if 'lumine' not in found:
    print("\n=== Lumine ===")
    found['lumine'] = "https://static.wikia.nocookie.net/gensin-impact/images/a/a6/Lumine_Portrait.png/revision/latest/scale-to-width-down/1000?cb=20230930045507"
    print("  Using Genshin wiki portrait")

# 5. Anri Yoshioka - try more specific search
# The Romantic Killer characters on AniList use Japanese names
# Anri = 吉岡安里 (Yoshioka Anri) - might not be on AniList
# Let me try a web search for an image
if 'anri-yoshioka' not in found:
    print("\n=== Anri Yoshioka (Romantic Killer) ===")
    # Check if there's a "Riri" that could be her
    result = api(SEARCH_QUERY, {"search": "Riri Romantic Killer"})
    time.sleep(0.7)
    if result:
        chars = result.get('data', {}).get('Page', {}).get('characters', [])
        for c in chars:
            mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
            mt_str = ' '.join(mt).lower()
            if 'romantic' in mt_str:
                print(f"  Found: {c['name']['full']}")
                found['anri-yoshioka'] = c['image']['large']
                break
        else:
            print(f"  Got: {[c['name']['full'] for c in chars]}")

# 6. Ryo Mukohara - same approach
if 'ryo-mukohara' not in found:
    print("\n=== Ryo Mukohara (Romantic Killer) ===")
    result = api(SEARCH_QUERY, {"search": "Romantic Killer Ryo"})
    time.sleep(0.7)
    if result:
        chars = result.get('data', {}).get('Page', {}).get('characters', [])
        for c in chars:
            mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
            mt_str = ' '.join(mt).lower()
            if 'romantic' in mt_str:
                print(f"  Found: {c['name']['full']}")
                found['ryo-mukohara'] = c['image']['large']
                break
        else:
            print(f"  Got: {[c['name']['full'] for c in chars]}")

# 7. Himeko Murata - search in Honkai
if 'himeko-murata' not in found:
    print("\n=== Himeko Murata (Honkai) ===")
    result = api(SEARCH_QUERY, {"search": "Murata Himeko"})
    time.sleep(0.7)
    if result:
        chars = result.get('data', {}).get('Page', {}).get('characters', [])
        for c in chars:
            mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
            mt_str = ' '.join(mt).lower()
            if 'honkai' in mt_str or 'benghuai' in mt_str or 'valkyrie' in mt_str:
                print(f"  Found: {c['name']['full']}")
                found['himeko-murata'] = c['image']['large']
                break
        else:
            print(f"  Got: {[c['name']['full'] for c in chars]}")

# 8. Sesshouin Kiara - search Fate/Extra
if 'sesshouin-kiara' not in found:
    print("\n=== Sesshouin Kiara (Fate/Extra) ===")
    for s in ["Kiara Sesshouin", "Sesshouin Kiara Fate"]:
        result = api(SEARCH_QUERY, {"search": s})
        time.sleep(0.7)
        if result:
            chars = result.get('data', {}).get('Page', {}).get('characters', [])
            for c in chars:
                mt = [m['title'].get('romaji','') for m in c.get('media',{}).get('nodes',[]) if m.get('title')]
                mt_str = ' '.join(mt).lower()
                if 'fate' in mt_str:
                    print(f"  Found: {c['name']['full']}")
                    found['sesshouin-kiara'] = c['image']['large']
                    break
            else:
                print(f"  Got: {[c['name']['full'] for c in chars[:5]]}")

# Apply found URLs to file
if found:
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
                print(f"  ✓ Updated {cid}")
    
    if updates > 0:
        with open('lib/characters.ts', 'w') as f:
            f.write(content)
        print(f"\nApplied {updates} fixes!")

# Check IDs that errored earlier
print("\n=== Checking errored IDs ===")
for cid, al_id in [('toshiro-hitsugaya', 245), ('aizen-sosuke', 1086), 
                    ('garfield-tinsel', 35144), ('shogo-makishima', 27160),
                    ('sasaki-haise', 88409), ('sesshouin-kiara', 6035),
                    ('klein', 36830)]:
    result = api(ID_QUERY, {"id": al_id})
    time.sleep(0.5)
    if result:
        char = result.get('data', {}).get('Character')
        if char:
            mt = [m['title'].get('romaji','') for m in char.get('media',{}).get('nodes',[]) if m.get('title')]
            print(f"  {cid}: {char['name']['full']:30s} [{' '.join(mt[:2]):50s}]")

print("\nDone!")
