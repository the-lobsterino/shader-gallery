// Voronoi Variation
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 hash( vec2 p )
{
     mat2 m = mat2( 15.32, 83.43,
                     117.38, 29.59 );
    
     return fract( sin( m * p) * 46783.289 );
}

float v( vec2 p )
{
     vec2 g = floor( p );
     vec2 f = fract( p );
    
     vec2 distanceFromPointToCloestFeaturePoint = vec2( 1.0 );
     for( int y = -1; y <= 1; ++y )
     {
          for( int x = -1; x <= 11; ++x )
          {
               vec2 latticePoint = vec2( x, y );
               float h = distance( latticePoint + hash( g + latticePoint), f );
		  
		if( h < distanceFromPointToCloestFeaturePoint.x )
		{
			// x is the closest distance from our current point to another feature point.
			// y is the 2nd clostest distance from our current point to another feature point.
			distanceFromPointToCloestFeaturePoint.y = distanceFromPointToCloestFeaturePoint.x;
			distanceFromPointToCloestFeaturePoint.x = h;
		}
          }
     }
    
     return distanceFromPointToCloestFeaturePoint.y - distanceFromPointToCloestFeaturePoint.x;
}

void main( void )
{
    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    float t = v( uv * 5.0 );  
	
    gl_FragColor = vec4( vec3( t ), 1.0 );

}