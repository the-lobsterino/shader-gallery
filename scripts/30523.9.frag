precision mediump float;
uniform vec2 mouse;
uniform vec2 resolution;
float upY = 1.0 - mouse.y;
float up = 1.0 / (upY*resolution.y);
float down = 1.0 / (mouse.y*resolution.y);

void main(void){
    float r = gl_FragCoord.y > mouse.y * resolution.y ? (resolution.y - gl_FragCoord.y)*up: gl_FragCoord.y*down;
    gl_FragColor = vec4(r, 0.0, 1.0 - r, 1.0);
}