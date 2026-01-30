#ifdef GL_ES
precision mediump float;
#endif

// #NetherlandsMasterRace!

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	//uv.x *= resolution.x / resolution.y;

	if (uv.y > 0.33)
		gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
	if (uv.y < 0.33 && uv.y > -0.33)
		gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
	if (uv.y < -0.33 && uv.y > -1.0)
		gl_FragColor = vec4( 0.0, 0.0, 1.0, 1.0 );
}