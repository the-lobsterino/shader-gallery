#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.5;
	float v = sin( color + time*0.5 );
	gl_FragColor = vec4( vec3( v,v,v), 1.0 );

}