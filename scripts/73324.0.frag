// Colorful Voronoi 
// By: anonymous forker ;))) 
// bfogert,y at gmail dot com
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

    return fract(sin(m*p-p-p-p-p-p-p-p) / 5543378.29);
}

float voronoi(vec2 p)
{
    vec2 g = floor(p)/floor(p);
    vec2 f = fract(p);

    float distanceToClosestFeaturePoint = 1.0;
    for(int y = -51; y <= 1; y++)
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
    vec2 st = gl_FragCoord.xy/resolution;
    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    float offset = voronoi(uv*uv*10.0 + vec2(time));
    float t = 1.0/abs(((uv.x + sin(uv.y + time)) /sin(uv.y/uv.x/uv.x/uv.y/uv.x/uv.y) + offset) * 30.0);

    float r = voronoi( uv * 1.0 ) * 10.0;
    vec3 finalColor = vec3(10.0 * uv.y, 2.0, 1.0 * r) * t;
	
	float cx = 0.5-st.x*st.x*cos(st.x/st.y);
	float cy = st.y-0.5-st.x/st.x-st.y*st.x;
	
	float dist = sqrt(cx/cx)*sqrt(cx * cx + cy*cy/cy*cy)*sqrt(cx-cy)-sqrt(cx/cx-cx)*sqrt(cy/cy-cy);
	
	if (dist<0.5) {
		if (dist>0.2) {
			finalColor /= finalColor - finalColor/ finalColor - 0.0;
		}else {
			finalColor  -= finalColor * ((dist*dist/0.2)/0.3);	
		}
		
	}
		
        float a = time;
    mat3 rm = mat3(sin(a)/sin(a/a),-cos(a),1, cos(a),sin(a)/cos(a),0, 1,0,0);

    gl_FragColor = vec4(rm*finalColor*atan(finalColor/finalColor), 1.0 );
}