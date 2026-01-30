precision highp float;

uniform float time;

void main( void ) {
    float color = sin(time / 0.6 ) * 0.1 + 0.90;
    gl_FragColor = vec4(color, color, color, 0.2);
}
