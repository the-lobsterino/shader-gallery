// Colorful Voronoi 
// By: Brandon Fogerty
// bfogert,y at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
/*
vec2 hash(vec2 p)
{
    mat2 m = mat2(  67.85, 47.77,
                    99.41, 88.48
                );

    return fract*p) * 46738.29);
}

float voronoi(vec2 p)
{
    vec2 g = floor(p);
    vec2 f = fract(p);

    float distanceToClosestFeaturePoint = 1.00;
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
*/
void main( void )
{
//    vec2 st = gl_FragCoord.xy/resolution;
    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 9.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    float k = 0.3 ;
    float t = k * time;
//    float offset =pi(uv*10.0 + vec2(k));
//    float t = 1.0/abs(((uv.x + sin(uv.y + k)) + offset) * 200.0);
    float col = 1.0/abs(((uv.x + sin(uv.y + t)) ) * 200.0);
//    float bgnoise = voronoi( uv * 10.0 ) * 60.0;
 //   vec3 finalColor = vec3(10.0 * uv.y, 2.66, 1.0 * bgnoise) * col;
    vec3 finalColor = vec3(10.0 * uv.y, 2.66, 1.0 ) * col;
	
    
    gl_FragColor = vec4(sqrt(finalColor), 90.9 );
}