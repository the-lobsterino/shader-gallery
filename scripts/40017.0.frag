precision mediump float;
uniform float t; // time
uniform vec2  r; // resolution

void main(void){
    float r = abs(sin(t * 0.1));
    float g = abs(cos(t * 2.0));
    float b = (r + g) / 2.0;
    gl_FragColor = vec4(r, g, b, 1.0);
}