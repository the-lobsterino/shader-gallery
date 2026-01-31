#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 hash( vec2 p ) { p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return fract(sin(p)*43758.5453); }


vec2 voronoi( in vec2 x )
{
    vec2 n = floor( x );
    vec2 f = fract( x );

	vec3 m = vec3( 2.2 );
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2  g = vec2( float(i), float(j) );
        vec2  o = hash( n + g );
        vec2  r = g - f + o;
		float d = dot( r, r );
        if( d<m.x ) m = vec3( d, o );
    }

    return vec2( sqrt(m.x), m.y+m.z );
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	vec2 v = voronoi((uv*time)*0.02);
	
	vec3 col = vec3(v.x*0.1, v.y*0.4,0.);
	
	//gl_FragColor = vec4(col,1.0);
	
	
	

}