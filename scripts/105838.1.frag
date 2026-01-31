precision mediump float;
uniform float time;
uniform vec2  resolution;

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    // ring
    float u = abs(sin((atan(p.y, p.x)*2. + length(p) * 1.85) * 2.5-time) * 0.3);
    float t = 0.05 / abs(u + .6+sin(time)/2. - length(p));
    
    gl_FragColor = vec4(vec3(t), 1.0);
}