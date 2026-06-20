#!/usr/bin/env python3
"""
Fix remaining wrong matches using Fandom wiki images + correct AniList IDs.
"""
import json, re, time, urllib.request, urllib.error

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
API_URL = 'https://graphql.anilist.co'

def wiki_api(wiki_base, params):
    """Call Fandom MediaWiki API."""
    url = f'{wiki_base}/api.php?{params}&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    for attempt in range(3):
        try:
            resp = urllib.request.urlopen(req, timeout=15)
            return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(3)
            else:
                return None
        except:
            return None
    return None

def find_portrait(wiki_base, character_name):
    """Search for a character portrait image on a Fandom wiki."""
    # Search for images starting with the character name + Portrait
    imgs = wiki_api(wiki_base, f'action=query&list=allimages&aifrom={urllib.request.quote(character_name)}_Portrait&ailimit=5&prop=imageinfo&iiprop=url')
    if imgs:
        results = imgs.get('query', {}).get('allimages', [])
        for img in results:
            name = img.get('name', '')
            if 'Portrait' in name or 'Character_Profile' in name:
                url = img['url']
                # Clean up URL - use scale-to-width for consistent sizing
                clean = re.sub(r'/revision/.*', '/revision/latest/scale-to-width-down/1000', url)
                return clean
    
    # Try profile image
    imgs = wiki_api(wiki_base, f'action=query&list=allimages&aifrom={urllib.request.quote(character_name)}_Profile&ailimit=5&prop=imageinfo&iiprop=url')
    if imgs:
        results = imgs.get('query', {}).get('allimages', [])
        for img in results:
            if 'Profile' in img.get('name', '') or 'Character_Card' in img.get('name', ''):
                url = img['url']
                clean = re.sub(r'/revision/.*', '/revision/latest/scale-to-width-down/1000', url)
                return clean
    
    # Try page main image
    data = wiki_api(wiki_base, f'action=query&titles={urllib.request.quote(character_name)}&prop=pageprops&format=json')
    if data:
        pages = data.get('query', {}).get('pages', {})
        for pid, pdata in pages.items():
            if 'pageprops' in pdata and 'page_image_free' in pdata['pageprops']:
                img_name = pdata['pageprops']['page_image_free']
                img_data = wiki_api(wiki_base, f'action=query&titles={urllib.request.quote(img_name)}&prop=imageinfo&iiprop=url')
                if img_data:
                    for pid2, pdata2 in img_data.get('query', {}).get('pages', {}).items():
                        if 'imageinfo' in pdata2:
                            url = pdata2['imageinfo'][0]['url']
                            clean = re.sub(r'/revision/.*', '/revision/latest/scale-to-width-down/1000', url)
                            return clean
    return None

def anilist_api(query, variables):
    """Call AniList GraphQL API."""
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
                time.sleep(5 * (attempt + 1))
            else:
                return None
        except:
            return None
    return None

# === TARGETS ===
# Characters to fix via web-scraped Fandom images
FIX_FANDOM = {
    "obito-uchiha": {
        "wiki": "https://naruto.fandom.com",
        "search": "Obito Uchiha"
    },
    "sasaki-haise": {
        "wiki": "https://tokyoghoul.fandom.com",
        "search": "Sasaki Haise"
    },
    "anri-yoshioka": {
        "wiki": "https://romantic-killer.fandom.com",
        "search": "Anri Yoshioka"
    },
    "ryo-mukohara": {
        "wiki": "https://romantic-killer.fandom.com",
        "search": "Ryo Mukohara"
    },
    "himeko-murata": {
        "wiki": "https://honkai-impact-3rd.fandom.com",
        "search": "Himeko Murata"
    },
}

# Characters to fix via correct AniList IDs (already found)
ANILIST_FIX = {
    "garfield-tinsel": 133847,  # Garfiel Tinsel (Re:Zero)
    "shogo-makishima": 69725,   # Shougo Makishima (Psycho-Pass)
    "sesshouin-kiara": 177074,  # Kiara Sessyoin (Fate/Extra)
}

CHAR_QUERY = '''
query ($id: Int) {
  Character(id: $id) { name { full } image { large } }
}
'''

def main():
    found = {}

    # === Fix via AniList IDs ===
    print("=== Fixing via AniList IDs ===", flush=True)
    for cid, al_id in ANILIST_FIX.items():
        result = anilist_api(CHAR_QUERY, {"id": al_id})
        time.sleep(0.5)
        if result:
            char = result.get('data', {}).get('Character')
            if char:
                found[cid] = char['image']['large']
                print(f"  {cid}: {char['name']['full']} ✓", flush=True)
            else:
                print(f"  {cid}: ID {al_id} not found", flush=True)
        else:
            print(f"  {cid}: API error", flush=True)

    # === Fix via Fandom wiki scraping ===
    print("\n=== Fixing via Fandom wiki scraping ===", flush=True)
    for cid, info in FIX_FANDOM.items():
        print(f"  {cid}: searching {info['wiki']} for '{info['search']}'...", flush=True)
        url = find_portrait(info['wiki'], info['search'])
        if url:
            found[cid] = url
            print(f"    Found portrait: {url[:80]}...", flush=True)
        else:
            print(f"    No portrait found!", flush=True)
        time.sleep(0.5)

    # === Apply fixes to characters.ts ===
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
                    print(f"  ✓ Applied fix for {cid}", flush=True)

        if updates > 0:
            with open('lib/characters.ts', 'w') as f:
                f.write(content)
            print(f"\nApplied {updates} fixes!", flush=True)
        else:
            print("\nNo fixes applied - character IDs not found in file?", flush=True)

    # === Final verification ===
    print("\n=== FINAL VERIFICATION ===", flush=True)
    with open('lib/characters.ts', 'r') as f:
        content = f.read()
    
    pattern = re.compile(r'(  \{\n(?:.|\n)*?\n  \},?\n)', re.MULTILINE)
    total = 0
    with_img = 0
    for m in pattern.finditer(content):
        total += 1
        if 'imageUrl:' in m.group(1):
            with_img += 1
    print(f"Total: {total}, With images: {with_img}, Missing: {total - with_img}", flush=True)

    # Verify the fixed characters
    verify_ids = list(ANILIST_FIX.keys()) + list(FIX_FANDOM.keys())
    for m in pattern.finditer(content):
        block = m.group(1)
        id_m = re.search(r'id: "(.+?)"', block)
        if id_m and id_m.group(1) in verify_ids:
            cid = id_m.group(1)
            name_m = re.search(r'name: "(.+?)"', block)
            img_m = re.search(r'imageUrl: "(.+?)"', block)
            name = name_m.group(1) if name_m else '?'
            img = img_m.group(1)[:70] if img_m else 'NONE'
            print(f"  {cid:25s} | {name:30s} | {img}", flush=True)

if __name__ == '__main__':
    main()
