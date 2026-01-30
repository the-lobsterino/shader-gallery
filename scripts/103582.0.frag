precision mediump float;

uniform vec2 uResolution;
uniform float uTime;

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    vec2 center = vec2(0.5, 0.5);
    
    float angle = atan(st.y - center.y, st.x - center.x);
    float radius = length(st - center);
    float helix1 = sin((angle * 8.0) + (uTime * 2.0)) * 0.1;
    float helix2 = sin((angle * 8.0) - (uTime * 2.0)) * 0.1;
    
    float shape = radius - helix1 - helix2;
    float gradient = smoothstep(0.01, 0.0, shape);
    
    gl_FragColor = vec4(vec3(gradient), 1.0);
}