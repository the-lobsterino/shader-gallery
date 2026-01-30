#ifdef GL_ES
precision mediump float;
#endif

void main(void){
    float a = gl_FragCoord.y / 256.0;
    gl_FragColor = vec4(vec3(a), 1.0);
}