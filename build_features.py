#!/usr/bin/env python3
"""
Extract features from shaders and compute similarity relations.
Uses inverted index to avoid O(n²) full comparison.
"""
import os
import re
import json
from collections import defaultdict
from pathlib import Path

SCRIPTS_DIR = Path('scripts')
COMMON_FUNCS = {'main', 'if', 'for', 'while', 'return'}
BUILTIN_TYPES = {'vec2', 'vec3', 'vec4', 'float', 'int', 'mat2', 'mat3', 'mat4', 'bool', 'void', 'sampler2D'}

def extract_features(code):
    """Extract function calls as features."""
    # Find function calls
    funcs = set(re.findall(r'\b([a-zA-Z_]\w*)\s*\(', code))
    # Remove common/builtin
    funcs -= COMMON_FUNCS
    funcs -= BUILTIN_TYPES
    return funcs

def jaccard(set1, set2):
    """Jaccard similarity coefficient."""
    if not set1 or not set2:
        return 0.0
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return intersection / union if union else 0.0

def main():
    print("Loading shaders...")
    shaders = {}
    for f in SCRIPTS_DIR.glob('*.frag'):
        shader_id = f.stem
        code = f.read_text(errors='ignore')
        features = extract_features(code)
        if features:  # Only include shaders with extractable features
            shaders[shader_id] = features
    
    print(f"Extracted features from {len(shaders)} shaders")
    
    # Build inverted index: feature -> set of shader_ids
    print("Building inverted index...")
    inverted = defaultdict(set)
    for sid, features in shaders.items():
        for feat in features:
            inverted[feat].add(sid)
    
    print(f"Index has {len(inverted)} unique features")
    
    # Compute relations using inverted index
    print("Computing similarities...")
    relations = {}
    processed = 0
    
    for sid, features in shaders.items():
        # Get candidate shaders (those sharing at least one feature)
        candidates = set()
        for feat in features:
            candidates.update(inverted[feat])
        candidates.discard(sid)  # Remove self
        
        # Compute similarity only with candidates
        similarities = []
        for cid in candidates:
            sim = jaccard(features, shaders[cid])
            if sim > 0.1:  # Threshold to reduce noise
                similarities.append((cid, sim))
        
        # Keep top 10
        similarities.sort(key=lambda x: -x[1])
        relations[sid] = [cid for cid, _ in similarities[:10]]
        
        processed += 1
        if processed % 1000 == 0:
            print(f"  {processed}/{len(shaders)}")
    
    # Save features (compact format)
    print("Saving features.json...")
    features_compact = {sid: list(feats) for sid, feats in shaders.items()}
    with open('features.json', 'w') as f:
        json.dump(features_compact, f)
    
    # Save relations
    print("Saving relations.json...")
    with open('relations.json', 'w') as f:
        json.dump(relations, f)
    
    print(f"Done! {len(relations)} shaders with relations.")

if __name__ == '__main__':
    main()
