#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    gl_FragColor = vec4(mouse.x, mouse.x, mouse.x, 1.0);
}