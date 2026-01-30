// Voronoi Portal
// Voronoi Variation + Fractional Brownian Motion
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

// modified by 27



 
#ifdef GL_ES
precision mediump float;
#endif
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
vec2 hash( vec2 p )
{
     mat2 m = mat2( 1.0, 1.0,
                     -27.6, 27.8 );
    
     return fract( sin( m * p) * (time*0.5) );
}
 
float voronoi( vec2 p )
{
     vec2 g = floor( p );
     vec2 f = fract( p );
    
     float distanceFromPointToCloestFeaturePoint = 2.0;
     for( int y = -1; y <= 1; ++y )
     {
          for( int x = -1; x <= 1; ++x )
          {
               vec2 latticePoint = vec2( x, y );
               float h = distance( latticePoint + hash( g + latticePoint), f );
          
        distanceFromPointToCloestFeaturePoint = min( distanceFromPointToCloestFeaturePoint, h ); 
          }
     }
    
     return   tan(distanceFromPointToCloestFeaturePoint);
}
 
float texture(vec2 uv )
{
    float t = voronoi( uv * 10.0 + vec2(uv.x,uv.y) );
        t *= 1.0-length(uv * 1.0);
    
    return t;
}
 
float fbm( vec2 uv )
{
    float sum = 1.0;
    float amp = 1.0;
    
    for( int i = 1; i < 4; ++i )
    {
        sum += texture( uv ) * amp;
        uv += uv;
        amp *= 5.0;
    }
    
    return sum;
}
 
void main( void )
{
    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    uv *= 0.50;
 
    float t = pow( fbm( uv  ), .725);
    
    gl_FragColor = vec4( vec3( t * 0.15, t * 0.5, t *time ), 1.0 );
 
}