#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dir(vec2 a, vec2 b) {
	return a.x*b.y - a.y*b.x;
}

float tri(vec2 p, vec2 a, vec2 b, vec2 c) {
	float d0 = dir(p - a, b - a);
	float d1 = dir(p - b, c - b);
	float d2 = dir(p - c, a - c);
	return min(min(d0, d1), d2);
}

float circ(vec2 p, float r) {
	return length(p) - r;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	float pi = 3.141592653589793;
	float tau = pi * 2.0;
	p = p * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	
	float t = pi + time * 0.2;
	float r = (0.5 + 0.5 * sin(time)) * 0.75;
	vec2 a = r * vec2(cos(t), sin(t));
	vec2 b = r * vec2(cos(t - tau / 3.0), sin(t - tau / 3.0));
	vec2 c = r * vec2(cos(t - tau / 3.0 * 2.0), sin(t - tau / 3.0 * 2.0));
	
	float d = 0.0;
	d = smoothstep(0.0, 0.005, circ(p - a, 0.15));
	d = min(d, smoothstep(0.0, 0.005, circ(p - b, 0.15)));
	d = min(d, smoothstep(0.0, 0.005, circ(p - c, 0.15)));
	d = max(d, smoothstep(0.0, 0.005, tri(p, a, b, c)));
	float col = 0.0;
	col = d; 

	gl_FragColor = vec4( vec3( col ), 1.0 );

}