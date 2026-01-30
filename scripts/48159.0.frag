#ifdef GL_ES
precision mediump float;
#endif


void main(void) {
    float r = gl_FragCoord.x / 255.0;
    float g = gl_FragCoord.y / 255.0;
    float b = 255.0;
    gl_FragColor = vec4(r, g, b, 1.0);
}