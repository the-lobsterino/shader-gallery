#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform float time;
uniform vec2  resolution;

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    // ring
    float u = abs(sin((atan(p.y, p.x) + length(p) * 1.85) * 2.5) * 0.3);
    float t = 0.025 / abs(u + 0.6 - length(p));
    vec3 o = mix(vec3(1.0, 1.0, 1.0), vec3(1.0, 0.0, 255.0), t);
    
    gl_FragColor = vec4(vec3(t), 1.0);
}