#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 posicion = gl_FragCoord.xy / resolution.xy;	
	gl_FragColor = vec4(sin(posicion.y+time), cos(posicion.x), posicion.x, 1);
}