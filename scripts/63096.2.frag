precision mediump float;
uniform float time;
uniform vec2  resolution;

void main(void){
    vec3 destColor = vec3(0.0, 0.3, 0.0);
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float l = 0.05 / abs(length(p) - 0.5);
    gl_FragColor = vec4(l*destColor, 1.0);
}