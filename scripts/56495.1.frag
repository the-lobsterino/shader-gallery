precision mediump float;
uniform float time; // time
uniform vec2 resolution; // resolution

void main(void){
    float t = time + (gl_FragCoord.x + gl_FragCoord.y*resolution.x)/resolution.x;
    float r = abs(sin(t)); // *1
    float g = abs(cos(t));
    float b = (r + g) / 2.0; // *2
    gl_FragColor = vec4(r, g, b, 1.0);
}