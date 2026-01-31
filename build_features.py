#!/usr/bin/env python3
"""
Ultra-light feature extraction - streaming approach.
"""
import os
import re
import json
from collections import defaultdict

SCRIPTS_DIR = 'scripts'
SKIP = {'main','if','for','while','return','else','vec2','vec3','vec4','float',
        'int','mat2','mat3','mat4','bool','void','sampler2D','uniform'}

def get_features(path):
    try:
        code = open(path, errors='ignore').read().lower()
        funcs = set(re.findall(r'\b([a-z][a-z0-9_]{2,10})\s*\(', code))
        return funcs - SKIP
    except:
        return set()

print("Loading...", flush=True)
files = [f for f in os.listdir(SCRIPTS_DIR) if f.endswith('.frag')]
print(f"Found {len(files)} shaders", flush=True)

# Phase 1: Build inverted index (feature -> shader_ids)
print("Building index...", flush=True)
inverted = defaultdict(list)
shader_features = {}

for i, f in enumerate(files):
    sid = f[:-5]  # remove .frag
    feats = get_features(f'{SCRIPTS_DIR}/{f}')
    if len(feats) >= 3:
        shader_features[sid] = feats
        for feat in feats:
            inverted[feat].append(sid)
    if (i+1) % 5000 == 0:
        print(f"  indexed {i+1}", flush=True)

print(f"Indexed {len(shader_features)} shaders", flush=True)

# Filter features used by 10-2000 shaders (useful for comparison)
good_feats = {f for f,sids in inverted.items() if 10 < len(sids) < 2000}
print(f"Using {len(good_feats)} features", flush=True)

# Phase 2: Compute relations batch by batch
print("Computing relations...", flush=True)
relations = {}
sids = list(shader_features.keys())

for i, sid in enumerate(sids):
    my_feats = shader_features[sid] & good_feats
    if len(my_feats) < 2:
        continue
    
    # Get candidates sharing any feature
    candidates = set()
    for f in my_feats:
        candidates.update(inverted[f])
    candidates.discard(sid)
    
    # Score by Jaccard
    scores = []
    for cid in candidates:
        their_feats = shader_features.get(cid, set()) & good_feats
        if len(their_feats) < 2:
            continue
        inter = len(my_feats & their_feats)
        union = len(my_feats | their_feats)
        if union > 0 and inter/union > 0.2:
            scores.append((cid, inter/union))
    
    scores.sort(key=lambda x: -x[1])
    if scores:
        relations[sid] = [c for c,_ in scores[:10]]
    
    if (i+1) % 5000 == 0:
        print(f"  processed {i+1}", flush=True)
        # Save checkpoint
        with open('relations.json', 'w') as f:
            json.dump(relations, f)

# Final save
with open('relations.json', 'w') as f:
    json.dump(relations, f)
print(f"Done! {len(relations)} shaders with relations", flush=True)
