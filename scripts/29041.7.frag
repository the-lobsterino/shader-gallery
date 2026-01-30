#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 random2f(vec2 p) {
	vec2 tmp = fract(vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));
	return tmp;
}

float voronoi( in vec2 x )
{
    vec2 p = vec2(floor( x ));
    vec2 f = fract( x );

    float res = 8.0;
    const float s = 1.0;	
    for( float j=-s; j<=s; j++ ) {
        for( float i=-s; i<=s; i++ ) {
	    vec2 b = vec2(i, j);
	    vec2  r = b - f + random2f(b + p);
	    float d = length(r);
	    res = min(res, d);
        }
    }
    return res;
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution.xy);
	p.x *= resolution.x / resolution.y;
	vec2 q = 2.0 * p - 1.0;
	float col = 1.0 - voronoi(q * 15.0);
	float temp = col;
	if(col > 0.7) {
		col = col - pow(col, 5.0);
	}
	gl_FragColor = vec4(col, col, col, 1.0);
}