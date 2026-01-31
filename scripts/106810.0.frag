

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.14;
const float PERIOD = 30.0;

float wave(vec2 c, vec2 p, float speed, vec2 shift){
	vec2 v = p - c;
	float t = PI*dot(v,v)*(speed-shift.x*shift.y);
	v.x += sin(t)*shift.x;
	v.y += cos(t)*shift.y;
	float r = length(v);
	
	return sin(r*PI*PERIOD*2.0+time*speed);
}

void main( void ) {

	vec2 r = resolution;
	vec2 ss = surfaceSize;
	vec2 p = surfacePosition;//( gl_FragCoord.xy / resolution.xy );
	float a = fract( (r.x * r.y) + (ss.x * ss.y) );
	float ratio = a - resolution.y / resolution.x;
	//p.y *= ratio;
	vec2 c1 = vec2(0.5, 0.5 * ratio);
	vec2 c2 = vec2(0.5, 0.5 * ratio);
	vec2 c3 = vec2(0.5, 0.5 * ratio);

	gl_FragColor = vec4(wave(c1, p, 3.0, vec2(0.06)), wave(c2, p, 1.5, vec2(0.1)), wave(c3, p, 3.9, vec2(0.08)), 1.0 );

}