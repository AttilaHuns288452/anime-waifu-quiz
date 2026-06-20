#!/usr/bin/env python3
"""
Aggressive Fandom wiki image search - find ANY main character image.
"""
import json, re, time, urllib.request, urllib.error

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

def wiki_api(wiki_base, params):
    url = f'{wiki_base}/api.php?{params}&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    for _ in range(3):
        try:
            resp = urllib.request.urlopen(req, timeout=15)
            return json.loads(resp.read())
        except:
            time.sleep(2)
    return None

def get_page_main_image(wiki_base, page_title):
    """Get the main infobox image for a wiki page."""
    # Method 1: pageprops page_image_free
    data = wiki_api(wiki_base, f'action=query&titles={urllib.request.quote(page_title)}&prop=pageprops')
    if data:
        for pid, pdata in data.get('query', {}).get('pages', {}).items():
            if 'pageprops' in pdata:
                pp = pdata['pageprops']
                # Check page_image_free
                img_key = pp.get('page_image_free') or pp.get('page_image')
                if img_key:
                    img_data = wiki_api(wiki_base, f'action=query&titles=File:{urllib.request.quote(img_key.replace(" ", "_"))}&prop=imageinfo&iiprop=url')
                    if img_data:
                        for pid2, pdata2 in img_data.get('query', {}).get('pages', {}).items():
                            if 'imageinfo' in pdata2:
                                url = pdata2['imageinfo'][0]['url']
                                clean = re.sub(r'/revision/.*', '/revision/latest/scale-to-width-down/1000', url)
                                return clean
    
    # Method 2: get images from page parsing
    data2 = wiki_api(wiki_base, f'action=parse&page={urllib.request.quote(page_title)}&prop=images&section=0')
    if data2:
        parse = data2.get('parse', {})
        images = parse.get('images', [])
        for img in images:
            if any(ext in img.lower() for ext in ['.png', '.jpg', '.jpeg']):
                if 'icon' not in img.lower() and 'logo' not in img.lower():
                    img_data = wiki_api(wiki_base, f'action=query&titles=File:{urllib.request.quote(img)}&prop=imageinfo&iiprop=url')
                    if img_data:
                        for pid2, pdata2 in img_data.get('query', {}).get('pages', {}).items():
                            if 'imageinfo' in pdata2:
                                url = pdata2['imageinfo'][0]['url']
                                if url and ('width' not in str(pdata2['imageinfo'][0].get('size', 0))):
                                    clean = re.sub(r'/revision/.*', '/revision/latest/scale-to-width-down/1000', url)
                                    return clean
    
    return None

def try_all_image_patterns(wiki_base, char_name):
    """Try every possible image naming pattern."""
    name = char_name.replace(' ', '_').replace("'", '%27')
    patterns = [
        f'{name}_Portrait',
        f'{name}_Profile',
        f'{name}',
        name.split('_')[0] if '_' in name else name,
        name.rsplit('_', 1)[0] if '_' in name else None,
    ]
    # De-dupe
    patterns = [p for p in patterns if p]
    seen = set()
    unique_patterns = []
    for p in patterns:
        if p.lower() not in seen:
            seen.add(p.lower())
            unique_patterns.append(p)
    
    for p in unique_patterns:
        data = wiki_api(wiki_base, f'action=query&list=allimages&aifrom={urllib.request.quote(p)}&ailimit=10&prop=imageinfo&iiprop=url')
        time.sleep(0.5)
        if data:
            imgs = data.get('query', {}).get('allimages', [])
            for img in imgs:
                name = img['name']
                # Skip icons, logos, small images
                if any(kw in name.lower() for kw in ['icon', 'logo', 'chibi', 'sticker', 'button']):
                    continue
                # Prefer character/portrait/profile/card images
                if any(kw in name.lower() for kw in ['portrait', 'profile', 'character', 'card']):
                    url = img['url']
                    clean = re.sub(r'/revision/.*', '/revision/latest/scale-to-width-down/1000', url)
                    return clean
    
    return None

# === TARGETS ===
TARGETS = {
    "obito-uchiha": {
        "wiki": "https://naruto.fandom.com",
        "page": "Obito Uchiha",
        "char": "Obito Uchiha"
    },
    "sasaki-haise": {
        "wiki": "https://tokyoghoul.fandom.com",
        "page": "Sasaki Haise",
        "char": "Sasaki Haise"
    },
    "anri-yoshioka": {
        "wiki": "https://romantic-killer.fandom.com",
        "page": "Anri Yoshioka",
        "char": "Anri Yoshioka"
    },
    "ryo-mukohara": {
        "wiki": "https://romantic-killer.fandom.com",
        "page": "Ryo Mukohara",
        "char": "Ryo Mukohara"
    },
    "himeko-murata": {
        "wiki": "https://honkai-impact-3rd.fandom.com",
        "page": "Himeko Murata",
        "char": "Himeko_Murata"
    },
}

found = {}

for cid, info in TARGETS.items():
    print(f"\n=== {cid} ===", flush=True)
    
    # Strategy 1: Main page image
    print(f"  Trying page main image for '{info['page']}'...", flush=True)
    url = get_page_main_image(info['wiki'], info['page'])
    if url:
        print(f"  ✓ Page image: {url[:80]}...", flush=True)
        found[cid] = url
        continue
    
    # Strategy 2: Image pattern search
    print(f"  Trying image name patterns...", flush=True)
    url = try_all_image_patterns(info['wiki'], info['char'])
    if url:
        print(f"  ✓ Pattern found: {url[:80]}...", flush=True)
        found[cid] = url
        continue
    
    # Strategy 3: Raw page parse for any image
    print(f"  Trying raw parse...", flush=True)
    data = wiki_api(info['wiki'], f'action=parse&page={urllib.request.quote(info["page"])}&prop=text&section=0&disablelimitreport=1')
    if data:
        text = data.get('parse', {}).get('text', {}).get('*', '')
        # Find first .png or .jpg in the HTML
        imgs = re.findall(r'(?:src="([^"]+\.(?:png|jpg|jpeg)(?:\?[^"]*)?))', text)
        for img_url in imgs:
            if 'wikia.nocookie.net' in img_url and 'icon' not in img_url.lower():
                clean = re.sub(r'/revision/.*', '/revision/latest/scale-to-width-down/1000', img_url)
                print(f"  ✓ Raw parse: {clean[:80]}...", flush=True)
                found[cid] = clean
                break
        else:
            print(f"  ✗ No image found in raw parse", flush=True)
    else:
        print(f"  ✗ Parse failed", flush=True)

# Apply fixes
if found:
    print(f"\n=== Applying {len(found)} fixes ===", flush=True)
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
    
    with open('lib/characters.ts', 'w') as f:
        f.write(content)
    print(f"Applied {updates} fixes!", flush=True)

# Final check
with open('lib/characters.ts', 'r') as f:
    content = f.read()
pattern = re.compile(r'(  \{\n(?:.|\n)*?\n  \},?\n)', re.MULTILINE)
total = with_img = 0
for m in pattern.finditer(content):
    total += 1
    if 'imageUrl:' in m.group(1):
        with_img += 1
print(f"\nTotal: {total}, With images: {with_img}")
