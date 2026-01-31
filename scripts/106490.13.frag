precision mediump float;

uniform vec2 resolution;
uniform float time;

float hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p.x) * 43758.5453);
}

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - vec2(1.0, 1.0);
    float len = length(uv);
    
    float angle = atan(uv.y, uv.x) + time * 0.3;  // Rotation over time
    float s = sin(angle);
    float c = cos(angle);
    vec2 rotatedUV = vec2(dot(uv, vec2(c, -s)), dot(uv, vec2(s, c)));

    // Continuous zoom in
    vec2 starUV = rotatedUV * (1.0 + time * 0.3);

    vec2 wrappedUV = fract(starUV * 0.3);  

    float starSize = 0.025;
    vec2 starPos = wrappedUV;
    float starMask = smoothstep(starSize, starSize + 0.015, length(starPos - 0.5));

    float noiseValue = hash(floor(wrappedUV * 10.0));  
    float starIntensity = smoothstep(0.97, 0.99, noiseValue) * starMask;

    vec3 starColor = vec3(1.0, 0.9, 0.7) * starIntensity;

    // Gradual disappearance as stars approach the center
    float fadeOut = smoothstep(0.1, 0.0, len);

    if(len > 0.95) discard;

    gl_FragColor = vec4(starColor, starIntensity * fadeOut);
}
