#extension GL_OES_standard_derivatives : enable 

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float cosNoise(in vec2 pos){
	return 0.7*(sin(pos.x*3.) + sin(pos.y*.7));
}

const mat2 m2 = mat2(0.8, -0.6, 0.6, 0.8); 

float map(in vec3 pos){
    vec2 q = pos.xz * 0.6;
    float h = 1.0;
        
    float s = 0.5;
    for(int i = 0; i<9; i++){
   	   h += s*cosNoise(q);
       s *= 0.5;
       q = m2 * q  * 1.6;
    }
    
    h *= 4.0;
    
    // Add time-based distortion to the landscape's height
    h += 2.0 * sin(5.0 * pos.x + time) * sin(5.0 * pos.z + time);
  
    return pos.y - h;
}

vec3 calcNormal(in vec3 pos){
	vec3 nor;
    vec2 e = vec2(0.01,0.00001);
    nor.x = map(pos + e.xyy) - map(pos - e.xyy);
    nor.y = map(pos + e.yxy) - map(pos - e.yxy);
    nor.z = map(pos + e.yyx) - map(pos - e.yyx);
    return normalize(nor);
}

float calcShadow(in vec3 ro, in vec3 rd){
    float res = 1.0;
    float t = 0.1;
    for (int i = 0; i <16; i++){
    	vec3 pos = ro + t*rd;
        float h = map(pos);
       res = min( res, max(h,0.0)*1.02/t );
        if(res< 1.0) break;
        t+=h*0.1;
    }
    return res;
}

// ... [Previous Functions and Declarations]

// Glitch effect based on time
vec2 glitchEffect(vec2 p) {
    float amt1 = sin(time * 10.0) * 0.02;
    float amt2 = cos(time * 7.0) * 0.03;
    p.x += step(0.9, mod(time*6.0, 2.0)) * amt1;
    p.y += step(0.8, mod(time*4.0, 2.0)) * amt2;
    return p;
}

// Composite multiple layers with different offsets
vec3 layerCompositing(vec3 col, vec3 pos) {
    float layer = sin(pos.y * 10.0 + time * 2.0) * 0.5 + 0.5;
    col = mix(col, vec3(0.2, 0.5, 0.7), layer);
    return col;
}

// Inversion effect based on position and time
vec3 inversionEffect(vec3 col, vec2 pos) {
    float invert = sin(1. + pos.x * pos.y) * 0.5 + 0.5;
    return mix(col, vec3(1.0) - col, invert);
}

// Motion blur effect
vec3 motionBlurEffect(vec3 col, vec2 p, vec3 rd) {
    vec3 blurCol = vec3(0.0);
    int samples = 5;
    for (int i = 0; i < 5; i++) {
        float tt = float(i) / float(samples - 1);
        vec3 ro = vec3(100.0 + tt * 30.0, 19.0, -time * 0.04);
        vec3 pos = ro + rd * tt;
        float h = map(pos);
        blurCol += vec3(h);
    }
    blurCol /= float(samples);
    return mix(col, blurCol, 0.5);
}
// ... [Previous Functions and Declarations]


// Pixelation effect
vec2 pixelate(vec2 uv, float resolution) {
    uv *= resolution;
    return floor(uv) / resolution;
}

// Sample glitching effect
vec2 sampleGlitch(vec2 uv, float time) {
    float glitchAmt = step(0.95, mod(time * 10.0, 1.0));
    return uv + vec2(glitchAmt * sin(uv.y * 50.0) * 0.05, 0.0);
}

// ... [Previous Functions and Declarations]

// UV slicing and offsetting for the cut-up effect
vec2 sliceAndCutUV(vec2 uv, float time) {
    // Define the number of slices
    float slices = 20.0;
    
    // Calculate slice width and height
    float sliceWidth = 1.0 / slices;
    float sliceHeight = 1.0 / slices;
    
    // Determine current slice for the given uv
    vec2 sliceIndex = floor(vec2(uv.x / sliceWidth, uv.y / sliceHeight));
    
    // Apply time-based offset to the slices
    float xOffset = sin(time + sliceIndex.y) * 0.5;
    float yOffset = cos(time + sliceIndex.x) * 0.25;
    
    // Offset the uv coordinates within the slice
    uv.x = mod(uv.x + xOffset, sliceWidth) + sliceIndex.x * sliceWidth;
    uv.y = mod(uv.y + yOffset, sliceHeight) + sliceIndex.y * sliceHeight;
    
    return uv;
}

void main()
{
    vec2 p = gl_FragCoord.xy / resolution.xy;
    vec2 q = -1.0 + 2.0 * p;
    q.x *= 1.5;

    // Apply UV slicing and cutting effect
    vec2 slicedUV = sliceAndCutUV(p, time);

    vec3 ro = vec3(100.0,  19.0, -time * 0.04);
    vec3 rd = normalize(vec3(q.x, q.y - 1.5, -1.0));

    vec3 col = vec3(0.4, 0.8, 1.0);
    float tmax = 50.0;
    float t = 0.0;

    for(int i=0; i<32; i++){
        vec3 pos = ro + rd*t;
        float h = map(pos);
        if(h < 0.1 || t > tmax) break;
        
        t += h*0.25;
    }
    
    vec3 light = normalize(vec3(0.1,0.1,-0.9));

    if(t < tmax){
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal(pos);
        float sha = calcShadow(pos + nor *0.1,light);

        float dif = clamp(dot(nor,light), 0.0,1.0);
        vec3 lig = vec3(1.0, 1.0, 0.0)*dif*sha;
        lig += vec3(0.1, 0.1, 0.1)*nor.y*1.0;
        
        vec3 mate = vec3(0.2, 0.6, 0.5);
        mate = mix(mate, vec3(0.3, 0.5, 0.5), smoothstep(1.7, 0.9, nor.y));
        col = lig * mate;

        // Apply layer compositing
        col = layerCompositing(col, pos);

        float fog = exp(-0.00002 * t * t * t);
        col += ((1.0 - fog) * vec3(0.1, 0.8, 1.0));
    }
    
    gl_FragColor = vec4(sqrt(col), 2.0);
}

