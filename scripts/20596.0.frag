#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float exp = exp(-position.x*position.x/(mouse.x));
	//gl_FragColor = vec4( vec3( float(exp>position.y)), 1.0 );	
	gl_FragColor = vec4( vec3( smoothstep(0.0,.0155,exp-position.y) * smoothstep(0.0315,.01355,exp-position.y)), 1.0 );
}