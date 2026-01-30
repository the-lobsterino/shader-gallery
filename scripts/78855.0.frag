// Colorful Voronoi
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 hash(vec2 p)
{
    mat2 m = mat2(
	3.85, 47.77,
	99.41, 98.48
    );

    return fract(sin(m * p) * 78.29);
}

float voronoi(vec2 p)
{
    vec2 g = floor(p);
    vec2 f = fract(p);

    float distanceToClosestFeaturePoint = 6.0;
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

void main( void )
{
    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    float offset = voronoi(uv*10.0 + vec2(time));
    float t = 1.0/abs(((uv.x + sin(uv.y + time)) + offset) * 90.0);

    float r = voronoi( uv * 1.0 ) * 10.0;
    vec3 finalColor = vec3(190.0 * uv.y, 28.0, 5.0 * r) * t;
    
    gl_FragColor = vec4(finalColor, 13.0 );
}