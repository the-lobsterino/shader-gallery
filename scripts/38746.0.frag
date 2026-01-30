#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float chebyLength(vec2 v)
{
	return max(abs(v.x),abs(v.y));
}

vec2 hash(vec2 p) {
	mat2 m = mat2(15.32, 35.64, 75.89, 153.23);
	return fract(sin(m * p) * 43758.23);
}

vec2 shash(vec2 p) {
	return hash(p) * 2.0 - 1.0;
}

float noise(vec2 p) {
	vec2 g = floor(p);
	vec2 f = fract(p);
	vec2 k = f*f*f*(6.0*f*f - 15.0*f + 10.0);
	float lt = dot(shash(g + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
	float rt = dot(shash(g + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
	float lb = dot(shash(g + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));	       
	float rb = dot(shash(g + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
	float t = mix(lt, rt, k.x);
	float b = mix(lb, rb, k.x);
	return 0.5 + 0.5 * mix(b, t, k.y);
}

float voronoi(vec2 p) {
	vec2 g = floor(p);
	vec2 f = fract(p);
	float res = 1.0;
	for(int i = -1; i <= 1; i++) {
		for(int j = -1; j <= 1; j++) {
			vec2 b = vec2(i, j);
			float d = chebyLength(b + hash(g + b) - f);
			res = min(res, d);
		}
	}
	return res;
}



void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p.x *= resolution.x / resolution.y;
	p.x += (resolution.y - resolution.x) / resolution.y * 0.5;

	float x = distance(vec2(0.5, 0.5), p) * 5.0;
	float c = abs(2.0 * (x - floor(x + 0.5)));
	x *= voronoi(p * 10.0);
	c = pow(2.0*abs((x - time) - floor(x - time) - 0.5), 2.0);
	
	gl_FragColor = vec4( 0.5, 0.1, c, 1.0 );

}