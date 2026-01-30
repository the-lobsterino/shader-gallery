// Colorful Voronoi
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 hash(vec2 p)
{
    mat2 m = mat2(  13.85, 47.77,
                    99.41, 88.48
                );

    return fract(sin(m*p) * 46738.29);
}

float voronoi(vec2 p)
{
    vec2 g = floor(p);
    vec2 f = fract(p);

    float distanceToClosestFeaturePoint = 1.0;
    for(int y = -1; y <= 1; y++)
    {
        for(int x = -1; x <= 1; x++)
        {
            vec2 latticePoint = vec2(x, y);
            float currentDistance = distance(latticePoint + hash(g+latticePoint), f);
            distanceToClosestFeaturePoint = min(distanceToClosestFeaturePoint, currentDistance);
        }
    }

    return distanceToClosestFeaturePoint;
}


vec3 rings( void ) {

	vec2 position = ( gl_FragCoord.xy - resolution.xy * 0.5 ) / ( resolution.y * 0.5 );
	vec2 mousePos = ( mouse.xy - 0.5 );
	
	position = mix( position - mousePos * 0.3,position, length( position ) * 1.0 );
	float r = length( position );
	
	float t = r;
	
	float time0 = time;
	
	float s = cos( pow( t, -0.6 ) * 10.0 + time0 * 12.0 ) * 0.5 + 0.5;

	vec3 color = mix( vec3( 0.6 + r * 0.3, 0.6 + r * 0.4, 0.6 + r ) * 1.0, vec3( 0.8, 0.8, 1 ) * 0.7, pow( s, 0.1 ) ) * pow( r, 0.5 );

	return color;
}

//Goal to make the rings the white shimmer stuff

void main( void )
{
    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    float offset = voronoi(uv*10.0 + vec2(time*8.));
    float t = 1.0/abs(((uv.x + sin(uv.y + time)) + offset) * 30.0);

    float r = voronoi( uv * 1.0 ) * 10.0;
	
	vec3 ringMod = rings();	
	
    vec3 finalColor = vec3(10.0, 2.0, 1.0 * r) * t*ringMod.g;
    

	
    gl_FragColor = vec4(finalColor, 1.0 );
}