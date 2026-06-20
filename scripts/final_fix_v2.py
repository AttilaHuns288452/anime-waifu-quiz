#!/usr/bin/env python3
"""
Final fix: resolve remaining mismatches.
1. Sasaki Haise → Ken Kaneki (same person, AniList ID 87275)
2. Anri Yoshioka → Romantic Killer key visual or AniList anime cover
3. Ryo Mukohara → same as above
4. Verify Obito Uchiha and Himeko Murata
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
                time.sleep(5)
            else:
                return None
        except:
            return None
    return None

def wiki_get_image_url(wiki_base, page_title):
    """Get the main page image from a Fandom wiki."""
    data = wiki_api(f'action=query&titles={urllib.request.quote(page_title)}&prop=pageprops')
    if data:
        pages = data.get('query', {}).get('pages', {})
        for pid, pdata in pages.items():
            props = pdata.get('pageprops', {})
            for key in ['page_image_free', 'page_image']:
                if key in props:
                    img_name = props[key]
                    safe_img = img_name.replace(' ', '_')
                    img_data = wiki_api(f'action=query&titles=File:{urllib.request.quote(safe_img)}&prop=imageinfo&iiprop=url')
                    if img_data:
                        for pid2, pdata2 in img_data.get('query', {}).get('pages', {}).items():
                            if 'imageinfo' in pdata2:
                                url = pdata2['imageinfo'][0]['url']
                                return re.sub(r'/revision/.*', '/revision/latest/scale-to-width-down/1000', url)
    return None

def wiki_api(params):
    url = f'https://naruto.fandom.com/api.php?{params}&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    for _ in range(3):
        try:
            resp = urllib.request.urlopen(req, timeout=10)
            return json.loads(resp.read())
        except:
            time.sleep(2)
    return None

# Get Ken Kaneki's image
print("=== Fixing Sasaki Haise -> Ken Kaneki ===", flush=True)
result = api('query($id:Int){Character(id:$id){image{large}}}', {"id": 87275})
ken_kaneki_img = None
if result:
    char = result.get('data', {}).get('Character')
    if char:
        ken_kaneki_img = char['image']['large']
        print(f"  Ken Kaneki image: {ken_kaneki_img}", flush=True)
time.sleep(0.5)

# Get Romantic Killer cover art for minor characters
print("\n=== Getting Romantic Killer key visual ===", flush=True)
result = api('query($s:String){Media(search:$s,type:ANIME){coverImage{large}}}', {"s": "Romantic Killer"})
rk_cover = None
if result:
    media = result.get('data', {}).get('Media')
    if media:
        rk_cover = media['coverImage']['large']
        print(f"  Romantic Killer cover: {rk_cover}", flush=True)
time.sleep(0.5)

# Verify Obito's current image by checking what it looks like (Naruto wiki)
print("\n=== Verifying Obito Uchiha image ===", flush=True)
obito_img = wiki_get_image_url('https://naruto.fandom.com', 'Obito Uchiha')
print(f"  Obito image URL: {obito_img[:80] if obito_img else 'NOT FOUND'}...", flush=True)

# Verify Himeko's image is correct (Jizi Wuliangta = Himeko from Honkai)
print("\n=== Verifying Himeko Murata (Jizi Wuliangta) ===", flush=True)
result = api('query($id:Int){Character(id:$id){name{full} image{large} media(page:1,perPage:3){nodes{title{romaji}}}}}', {"id": 142944})
if result:
    char = result.get('data', {}).get('Character')
    if char:
        mt = [m['title'].get('romaji','') for m in char.get('media',{}).get('nodes',[]) if m.get('title')]
        print(f"  Name: {char['name']['full']}", flush=True)
        print(f"  Media: {' '.join(mt[:2])}", flush=True)
        print(f"  Image: {char['image']['large'][:80]}...", flush=True)
        # Validate - Benghuai 3 = Honkai Impact 3rd, so this IS Himeko
        if 'benghuai' in ' '.join(mt).lower() or 'valkyrie' in ' '.join(mt).lower():
            print(f"  ✓ CONFIRMED: This is Himeko from Honkai Impact 3rd!", flush=True)

# Apply fixes
print("\n=== Applying fixes ===", flush=True)
with open('lib/characters.ts', 'r') as f:
    content = f.read()

pattern = re.compile(r'(  \{\n(?:.|\n)*?\n  \},?\n)', re.MULTILINE)
fixes = {
    'sasaki-haise': ken_kaneki_img,
}
if rk_cover:
    fixes['anri-yoshioka'] = rk_cover
    fixes['ryo-mukohara'] = rk_cover

updates = 0
for m in pattern.finditer(content):
    block = m.group(1)
    id_m = re.search(r'id: "(.+?)"', block)
    if not id_m:
        continue
    cid = id_m.group(1)
    if cid in fixes and fixes[cid]:
        url = fixes[cid]
        old_img = re.search(r'  imageUrl: "(.+?)",?', block)
        if old_img:
            new_block = block.replace(old_img.group(0), f'  imageUrl: "{url}",')
            content = content.replace(block, new_block, 1)
            updates += 1
            print(f"  ✓ Fixed {cid}", flush=True)

if updates > 0:
    with open('lib/characters.ts', 'w') as f:
        f.write(content)
    print(f"\nApplied {updates} fixes!", flush=True)

# Final verification
print("\n=== FINAL VERIFICATION ===", flush=True)
pattern = re.compile(r'(  \{\n(?:.|\n)*?\n  \},?\n)', re.MULTILINE)
total = with_img = 0
for m in pattern.finditer(content):
    total += 1
    if 'imageUrl:' in m.group(1):
        with_img += 1
print(f"Total: {total}, With images: {with_img}", flush=True)

# Check specific characters
check_ids = ['obito-uchiha', 'sasaki-haise', 'anri-yoshioka', 'ryo-mukohara', 'himeko-murata',
             'garfield-tinsel', 'shogo-makishima', 'sesshouin-kiara', 'lady-nagant']
for m in pattern.finditer(content):
    block = m.group(1)
    id_m = re.search(r'id: "(.+?)"', block)
    if id_m and id_m.group(1) in check_ids:
        cid = id_m.group(1)
        name_m = re.search(r'name: "(.+?)"', block)
        img_m = re.search(r'imageUrl: "(.+?)"', block)
        print(f"  {cid:25s} | {name_m.group(1) if name_m else '?':30s} | {img_m.group(1)[:70] if img_m else 'NONE'}")
