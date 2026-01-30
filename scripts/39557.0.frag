#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 random2f(vec2 p) {
	vec2 tmp = fract(vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));
	return vec2(.5+.5*sin(tmp.x*time + p.y),.5+.5*cos(tmp.y*time + p.x));
}
float voronoi2( in vec2 x )
{
    vec2 p = vec2(floor( x ));
    vec2 f = fract( x );

    float res = 8.0;
    const float s = 1.0;	
    for( float j=-s; j<=s; j++ ) {
        for( float i=-s; i<=s; i++ ) {
		for(int a=0; a<=10; a++) {
	    vec2 b = vec2(i, j);
	    vec2  r = b - f + random2f(b + p);
	    float d = length(r);
	    res = min(res, d);
		}
        }
    }
    return res;
}

float voronoi( in vec2 x )
{
    vec2 p = vec2(floor( x ));
    vec2 f = fract( x );
	
    float res = 8.0;
    const float s = 1.0;	
    for( float j=-s; j<=s; j++ ) {
        for( float i=-s; i<=s; i++ ) {
	    float m = mod( 2. * abs( i + p.x ) + 3. * abs( j + p.y ), 7. );
	    vec2 b = vec2(i, j);
	    vec2  r = b - f + random2f(b + p);
	    float d = length(r) * pow( 1.2, m );
	    res = min(res, d);
        }
    }
    return 1. - res;
}

void main( void ) {

	vec2 p = gl_FragCoord.xy / resolution.xy;
	p.x *= resolution.x / resolution.y;
	vec2 q = 2.0 * p - 1.0;
	
	float col = voronoi(q * 27.0);	
	col += voronoi2(q * 1.27);
	gl_FragColor = vec4(col,col,col, 1.0);
}