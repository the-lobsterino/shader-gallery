#!/usr/bin/env python3
"""
Streaming similarity computation - minimal memory.
Phase 1: Extract features → features.jsonl (one shader per line)
Phase 2: Build inverted index from features.jsonl
Phase 3: Stream through, compute similarities, append to relations.jsonl
"""
import os, re, json, sys
from collections import defaultdict

SCRIPTS = 'scripts'
SKIP = {'main','if','for','while','return','else','vec2','vec3','vec4',
        'float','int','mat2','mat3','mat4','bool','void','sampler2D','uniform'}

def extract(path):
    try:
        code = open(path, errors='ignore').read().lower()
        return set(re.findall(r'\b([a-z][a-z0-9_]{2,10})\s*\(', code)) - SKIP
    except:
        return set()

def phase1():
    """Extract features to JSONL file"""
    print("Phase 1: Extracting features...", flush=True)
    files = [f for f in os.listdir(SCRIPTS) if f.endswith('.frag')]
    
    with open('features.jsonl', 'w') as out:
        for i, f in enumerate(files):
            sid = f[:-5]
            feats = list(extract(f'{SCRIPTS}/{f}'))
            if len(feats) >= 3:
                out.write(json.dumps({'id': sid, 'f': feats}) + '\n')
            if (i+1) % 5000 == 0:
                print(f"  {i+1}/{len(files)}", flush=True)
    print("  Done!", flush=True)

def phase2():
    """Build inverted index from features.jsonl"""
    print("Phase 2: Building inverted index...", flush=True)
    inverted = defaultdict(list)
    feat_counts = defaultdict(int)
    
    # First pass: count feature frequencies
    with open('features.jsonl') as f:
        for line in f:
            d = json.loads(line)
            for feat in d['f']:
                feat_counts[feat] += 1
    
    # Filter to useful features (10-2000 occurrences)
    good = {f for f, c in feat_counts.items() if 10 < c < 2000}
    print(f"  {len(good)} useful features", flush=True)
    
    # Second pass: build index with only good features
    with open('features.jsonl') as f:
        for line in f:
            d = json.loads(line)
            for feat in d['f']:
                if feat in good:
                    inverted[feat].append(d['id'])
    
    # Save index
    with open('index.json', 'w') as f:
        json.dump({k: v for k, v in inverted.items()}, f)
    
    # Also save good features per shader
    with open('features.jsonl') as f, open('features_filtered.jsonl', 'w') as out:
        for line in f:
            d = json.loads(line)
            filtered = [feat for feat in d['f'] if feat in good]
            if len(filtered) >= 2:
                out.write(json.dumps({'id': d['id'], 'f': filtered}) + '\n')
    print("  Done!", flush=True)

def phase3():
    """Compute relations streaming"""
    print("Phase 3: Computing relations...", flush=True)
    
    # Load index once
    with open('index.json') as f:
        inverted = json.load(f)
    
    # Load all features into memory (just id -> set, compact)
    features = {}
    with open('features_filtered.jsonl') as f:
        for line in f:
            d = json.loads(line)
            features[d['id']] = set(d['f'])
    print(f"  Loaded {len(features)} shaders", flush=True)
    
    # Process each shader
    relations = {}
    processed = 0
    
    for sid, my_feats in features.items():
        # Get candidates
        candidates = set()
        for feat in my_feats:
            if feat in inverted:
                candidates.update(inverted[feat])
        candidates.discard(sid)
        
        # Score candidates
        scores = []
        for cid in candidates:
            if cid not in features:
                continue
            their_feats = features[cid]
            inter = len(my_feats & their_feats)
            union = len(my_feats | their_feats)
            score = inter / union if union else 0
            if score > 0.2:
                scores.append((cid, score))
        
        scores.sort(key=lambda x: -x[1])
        if scores:
            relations[sid] = [c for c, _ in scores[:10]]
        
        processed += 1
        if processed % 5000 == 0:
            print(f"  {processed}/{len(features)}", flush=True)
    
    # Save final
    with open('relations.json', 'w') as f:
        json.dump(relations, f)
    print(f"Done! {len(relations)} shaders with relations", flush=True)

if __name__ == '__main__':
    phase1()
    phase2()
    phase3()
