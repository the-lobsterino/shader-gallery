#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float tw(float x) {
	return 1.0 - abs(mod(x+1.0, 4.0) - 2.0);
}

void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	float N = 4.0;

	float c = tw( uv.x * 4.0 * N) * 0.5 + 0.5;
	float d = sin( uv.x * 3.141592 * 2.0 * N ) * 0.5 + 0.5;
	
	vec3 v =vec3( pow( (uv.y > 0.5 ) ? c : d, 1.0/2.2 ) );
	
	gl_FragColor = vec4( v, 1.0 );
}
