#ifdef GL_ES
precision mediump float;
#endif

// http://www.iquilezles.org/www/articles/smoothvoronoi/smoothvoronoi.htm

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 random2f( vec2 seed ) {
	float t = sin(seed.x+seed.y*1e3 + mouse.x * 0.001 + mouse.y * 0.002);
	return vec2(fract(t*1e4), fract(t*1e6));
}

float voronoi( in vec2 x )
{
    vec2 p = floor( x );
    vec2  f = fract( x );

    float res = 0.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2 b = vec2( i, j );
        vec2  r = vec2( b ) - f + random2f( p + b + sin(time)*0.0000012 );
        float d = dot( r, r );

        res += 1.0/pow( d, 8.0 );
    }
    return pow( 1.0/res, 1.0/16.0 );
}

vec3 normal(vec2 p) {
	float d = 0.01;
	vec3 dx = vec3(d, 0.0, voronoi(p + vec2(d, 0.0))) - vec3(-d, 0.0, voronoi(p + vec2(-d, 0.0)));
	vec3 dy = vec3(0.0, d, voronoi(p + vec2(0.0, d))) - vec3(0.0, -d, voronoi(p + vec2(0.0, -d)));
	return normalize(cross(dx,dy));
}

void main( void )
{
	vec2 p = gl_FragCoord.xy / resolution.xy;

	float color = voronoi(p*15.);
//	gl_FragColor = vec4(vec3(color), 1.);
	//return;
	
	vec3 light = normalize(vec3(1.0,0.1,1.0));
	
	float shade = dot(light,normal(p*-15.))+0.0;
	gl_FragColor = vec4(vec3(shade*color), 1.0);
}