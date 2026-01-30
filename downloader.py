#!/usr/bin/env python3
"""
GLSL Sandbox Downloader
Downloads shaders and thumbnails from glslsandbox.com
"""
import requests
from bs4 import BeautifulSoup
import os
import json
import time
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.request import urlretrieve

os.makedirs('thumbs', exist_ok=True)
os.makedirs('scripts', exist_ok=True)

BASE_URL = 'https://glslsandbox.com'
downloaded = set()
errors = []

def log(msg):
    print(msg, flush=True)
    sys.stdout.flush()

def get_shader(shader_id):
    """Download a single shader and its thumbnail"""
    try:
        # Get shader code (API format: /item/ID)
        resp = requests.get(f'{BASE_URL}/item/{shader_id}', timeout=10)
        if resp.status_code != 200:
            return None
        
        data = resp.json()
        code = data.get('code', '')
        if not code:
            return None
        
        # Save shader code
        safe_id = shader_id.replace('/', '_')
        with open(f'scripts/{safe_id}.frag', 'w', encoding='utf-8') as f:
            f.write(code)
        
        # Try to get thumbnail
        try:
            thumb_url = f'{BASE_URL}/thumbs/{shader_id}.png'
            urlretrieve(thumb_url, f'thumbs/{safe_id}.png')
        except:
            pass  # Thumbnail optional
        
        return shader_id
    except Exception as e:
        errors.append((shader_id, str(e)))
        return None

def get_gallery_page(page):
    """Get shader IDs from a gallery page"""
    try:
        resp = requests.get(f'{BASE_URL}/?page={page}', timeout=10)
        soup = BeautifulSoup(resp.text, 'html.parser')
        links = soup.select('#gallery a')
        ids = []
        for link in links:
            href = link.get('href', '')
            # Format: /e#370395.0
            if '#' in href:
                shader_id = href.split('#')[1]
                ids.append(shader_id)
        return ids
    except Exception as e:
        log(f'Error getting page {page}: {e}')
        return []

def main():
    log('Starting GLSL Sandbox download...')
    
    # First, collect all shader IDs from gallery pages
    all_ids = set()
    page = 0
    empty_pages = 0
    max_pages = 100  # Limit to first 100 pages for now
    
    log('Collecting shader IDs from gallery...')
    while empty_pages < 3 and page < max_pages:
        ids = get_gallery_page(page)
        if ids:
            all_ids.update(ids)
            empty_pages = 0
            log(f'Page {page}: found {len(ids)} shaders (total: {len(all_ids)})')
        else:
            empty_pages += 1
            log(f'Page {page}: empty')
        page += 1
        time.sleep(0.2)  # Be nice to the server
    
    log(f'\nTotal shaders to download: {len(all_ids)}')
    
    # Check which ones we already have
    existing = {f.replace('.frag', '').replace('_', '/') for f in os.listdir('scripts') if f.endswith('.frag')}
    to_download = all_ids - existing
    log(f'Already have: {len(existing)}, need to download: {len(to_download)}')
    
    # Download with thread pool
    completed = 0
    successful = 0
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(get_shader, sid): sid for sid in to_download}
        for future in as_completed(futures):
            result = future.result()
            completed += 1
            if result:
                successful += 1
            if completed % 50 == 0:
                log(f'Progress: {completed}/{len(to_download)} ({successful} successful)')
    
    log(f'\nDownload complete!')
    log(f'Total shaders: {len(os.listdir("scripts"))}')
    log(f'Total thumbs: {len(os.listdir("thumbs"))}')
    log(f'Errors: {len(errors)}')
    
    # Save manifest
    scripts = [f.replace('.frag', '') for f in os.listdir('scripts') if f.endswith('.frag')]
    manifest = {
        'shaders': sorted(scripts, key=lambda x: (len(x), x)),
        'count': len(scripts),
        'errors': len(errors)
    }
    with open('manifest.json', 'w') as f:
        json.dump(manifest, f, indent=2)
    log('Saved manifest.json')

if __name__ == '__main__':
    main()
