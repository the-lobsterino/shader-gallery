// By: Brandon Fogerty
// bfogerty @ gmail dot com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float d =  1.0 - distance( p, vec2( 0.5, 0.5) );
	
	float tr = sin(time * 0.20)+0.1;
	vec3 c = vec3( d*tr, d, d);
	gl_FragColor = vec4( c, 1.0 );

}