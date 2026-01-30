precision mediump float;
uniform float t; // time
uniform vec2  r; // resolution

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
    vec2 q = mod(p, 0.2) - 0.1;
    float s = sin(t);
    float c = cos(t);
    q *= mat2(c, s, -s, c);
    float v = 0.1 / abs(q.y) * abs(q.x);
    float r = v * abs(sin(t * 6.0) + 1.5);
    float g = v * abs(sin(t * 4.5) + 1.5);
    float b = v * abs(sin(t * 3.0) + 1.5);
    gl_FragColor = vec4(r, g, b, 1.0);
}