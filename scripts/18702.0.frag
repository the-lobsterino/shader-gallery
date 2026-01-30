// Some code borrowed from IQ's awesome site:
// http://www.iquilezles.org/www/articles/smoothvoronoi/smoothvoronoi.htm

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec2 random2f( vec2 seed )
{
	float rnd1 = fract(sin(dot(seed, vec2(14.9898,78.233))) * 43758.5453);
	float rnd2 = fract(sin(dot(seed+vec2(rnd1), vec2(14.9898,78.233))) * 43758.5453);
	return vec2(rnd1, rnd2);
}

float voronoi( in vec2 x )
{
    vec2 p = floor( x );
    vec2 f = fract( x );

    float res = 12.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2 b = vec2( i, j );
        vec2 r = vec2( b ) - f + random2f( p + b );
        float d = dot( r, r );

        res = min( res, d );
    }
    return sqrt( res );
}

void main( void ) {

	vec2 position = surfacePosition * 1.0;

	float color = voronoi(position);

	gl_FragColor = vec4( color, 0.0, 0.0, 1.0 );

}