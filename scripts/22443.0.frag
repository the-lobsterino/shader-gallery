// Bias Example
// By: Brandon Fogerty
// bfogerty at gmail dot com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float bias( float x, float b )
{
	return pow( x, log(b)/log(0.5) );
}

vec2 bias( vec2 uv, float b )
{
	float x = bias( uv.x, b );
	float y = bias( uv.y, b );
	
	return vec2( x, y );
}

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;

	// Rotate UV coordinates
	float theta = time;
	float nx = uv.x * cos( theta) - uv.y * sin(theta );
	float ny = uv.x * sin( theta) + uv.y * cos(theta );
	uv = abs(vec2( nx, ny )); //was only getting 1 quadrant
	
	// Apply bias to particle
	float t = sin(time) * 0.5 + 0.5;
	float morphBias = mix( 0.25, 0.80, t );
	float r = length( bias( uv, morphBias ) );
	vec3 c = vec3( 4.0, 7.0, 7.5 ) * pow(r, 3.0 );
	

	gl_FragColor = vec4( c, 1.0 );

}