#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
 vec2 x = vec2(sin(gl_FragCoord.x*gl_FragCoord.y/sin(time)/10.0),sin(gl_FragCoord.y*gl_FragCoord.x/sin(time)/10.0));
 gl_FragColor = vec4(x,0.0,0.0);
}