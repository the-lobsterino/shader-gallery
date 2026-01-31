#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Simplex noise function
// Implementation based on https://github.com/ashima/webgl-noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
float noise(vec3 P) {
    vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));
    vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);
    vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x);
    vec4 iy = vec4(i0.yy, i1.yy);
    vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, f0);
    float n100 = dot(g100, vec3(f1.x, f0.yz));
    float n010 = dot(g010, vec3(f0.x, f1.y, f0.z));
    float n110 = dot(g110, vec3(f1.xy, f0.z));
    float n001 = dot(g001, vec3(f0.xy, f1.z));
    float n101 = dot(g101, vec3(f1.x, f0.y, f1.z));
    float n011 = dot(g011, vec3(f0.x, f1.yz));
    float n111 = dot(g111, f1);

    vec3 fade_xyz = fade(f0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
}

void main() {
    // Normalize coordinates
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // Background color
    vec3 backgroundColor = vec3(0.0, 0.0, 0.0);

    // Create multiple bubbles
    const float numBubbles = 8.0;
    float radius = 0.05 + random(vec2(time)) * 0.1; // Randomize bubble sizes

    for (float i = 0.0; i < numBubbles; i++) {
        // Randomize bubble position
        vec2 bubblePos = vec2(random(vec2(i, time)) - 0.5, random(vec2(time, i)) - 0.5) * 2.0;

        // Get noise-based movement for bubbles
        float noiseScale = 0.1;
        vec3 noiseVec = vec3(noise(vec3(bubblePos * noiseScale, time * 0.1)));
        bubblePos += noiseVec.xy * 0.1; // Adjust speed here

        // Calculate distance to bubble
        float dist = length(uv - bubblePos);

        // Create gradients for bubble colors
        vec3 color1 = vec3(0.2, 0.5, 0.9); // First color of gradient
        vec3 color2 = vec3(0.9, 0.2, 0.5); // Second color of gradient

        // Interpolate colors based on distance
        vec3 bubbleColor = mix(color1, color2, smoothstep(radius - 0.01, radius + 0.01, dist));

        // Anti-aliasing
        float blur = fwidth(dist);
        float alpha = 1.0 - smoothstep(radius - blur, radius + blur, dist);

        // Blend bubble color with background
        backgroundColor = mix(backgroundColor, bubbleColor, alpha);
    }

    // Output final color
    gl_FragColor = vec4(backgroundColor, 1.0);
}