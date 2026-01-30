#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand( vec2 uv ) {
	return fract( sin( dot( uv.xy, vec2( 12.235, 67.532 ) ) ) * 43289.24 );
}

float noise( vec2 pos ) {
	vec2 ip = floor( pos );
	vec2 fp = smoothstep(0.,1., fract(pos));
	vec2 a  = vec2( 
		rand( ip + vec2( 0.0, 0.0 ) ),
		rand( ip + vec2( 1.0, 0.0 ) )
	);
	vec2 b  = vec2(
		rand( ip + vec2( 0.0, 1.0 ) ),
		rand( ip + vec2( 1.0, 1.0 ) )
	);
	a = mix( a, b, fp.y );
	return mix( a.x, a.y, fp.x );
}

float perlin( vec2 pos ) {
	return  ( noise( pos ) * 32. +
		noise( pos * 2. ) * 16. +
		noise( pos * 4. ) * 8. +
		noise( pos * 8. ) * 4. +
		noise( pos * 16.) * 2. +
		noise( pos * 32.)) / 63.;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float color = perlin( position + vec2( 0.0, time ) );
	
	gl_FragColor = vec4( vec3( color * 1. ), 1.0 );

}