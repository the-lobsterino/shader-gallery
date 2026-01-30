precision mediump float;//https://wgld.org/d/glsl/g004.html
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

void main(void){
    vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    // ring
    float t = 0.02 / abs(0.5 - length(p));
    
    gl_FragColor = vec4(vec3(t), 1.6);
}