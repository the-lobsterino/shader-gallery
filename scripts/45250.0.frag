#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define FIELDOFVIEW 90.

#define CAMERA_ORIGIN vec3( 0.0, 0.0,   1.0 )
#define CAMERA_LOOKVT vec3( 0.0, 0.0, -1.0 )
#define CAMERA_DISTNC 1.0

vec3 ray( vec3 a, vec3 b, int axis ) {

	float m_x_to_y = (b.y - a.y) / (b.x - a.x);
	float m_x_to_z = (b.z - a.z) / (b.x - a.x);
	float m_y_to_x = (b.x - a.x) / (b.y - a.y);
	float m_y_to_z = (b.z - a.z) / (b.y - a.y);
	float m_z_to_x = (b.x - a.x) / (b.z - a.z);
	float m_z_to_y = (b.y - a.y) / (b.z - a.z);
	vec3 x_is_0 = vec3( 0.0, a.x - m_x_to_y * a.y, a.x - m_x_to_z * a.z );
	vec3 y_is_0 = vec3( a.y - m_y_to_x * a.x, 0.0, a.y - m_y_to_z * a.z );
	vec3 z_is_0 = vec3( a.z - m_z_to_x * a.x, a.z - m_z_to_y * a.y, 0.0 );
	if ( axis == 1 ) { return x_is_0; }
	if ( axis == 2 ) { return y_is_0; }
	if ( axis == 3 ) { return z_is_0; }

}

vec3 background( vec2 pos, vec2 res ) {

	pos *= vec2( 1., 1. + cos( pos.x ) / 3. );
	float alpha = sin( pos.y * res.y ) * .1 * 10.;
	return vec3( alpha * .28, alpha * .01, alpha * .01 + .1 );

}

vec3 vignette( vec3 rgb, vec2 pos ) {

	float vfade = ( ( cos( pos.x ) - 1. ) + ( cos( pos.y * 1.7 ) - 1. ) ) / 5.;
	return vec3( vfade ) + rgb;

}

vec3 checkerFloor( vec3 rgb, vec2 pos, float horizon ) {

	vec3 floorXY = ray( CAMERA_ORIGIN + vec3( 0.0, CAMERA_DISTNC, 0.0 ), CAMERA_ORIGIN + vec3( pos.x, CAMERA_DISTNC + pos.y, 0.0 ) + CAMERA_LOOKVT, 2 );
	if ( pos.y < horizon ) {
		rgb = ( vec3( floor( ( sin( floorXY.z * 5. ) + 1. ) ) ) + vec3( 1, 1, 1 ) ) / ( length( floorXY ) / 7. ) + vec3( 0.0, 0.0, 0.1 );
	}
	return rgb;

}

vec3 noiseGrain( vec3 rgb, vec2 pos, float hash ) {

	float noise = clamp( fract( cos( pos.x * 58402.4 + 5.432 - hash ) * 6026.2256 / sin( pos.y * 724.626 + hash ) ), 0.0, 1.0 );
	return vec3( ( noise / 4. ) + .6 ) * rgb;

}

void main( void ) {

	float minres = min( resolution.x, resolution.y );
	float maxres = max( resolution.x, resolution.y );
	float width  = resolution.x / minres;
	float height = resolution.y / minres;
	vec2  cur    = mouse - vec2( width * .5, height * .5 );
	vec2  pos    = gl_FragCoord.xy / minres - vec2( width * .5, height * .5 );
	vec3  rgb    = vec3( 0.0, 0.0, 0.0 );
	
	rgb = background   ( pos, resolution );
	rgb = checkerFloor ( rgb, pos, 0.0 );
	rgb = vignette     ( rgb, pos );
	rgb = noiseGrain   ( rgb, pos, time );

	gl_FragColor = vec4( rgb, 1.0 );

}