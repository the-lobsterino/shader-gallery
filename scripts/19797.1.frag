#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;
#define time time*60./17.+0.1*surfacePosition.y/sin(surfacePosition.x*3.+time*.1+length(surfacePosition))
uniform vec2 mouse;
uniform vec2 resolution;
const float pi = 3.141592653589793;

float gear(vec2 p, float n, float r_in, float r_out) {
	float a = 0.5 + 0.5 * atan(p.y, p.x) / pi;
	float r = r_in + r_out * clamp(4.0 * abs(fract(a * n) - 0.5) - 0.5, 0.0, 1.0);
	float d = length(p) - r;
	float c_body = smoothstep(0.01, 0.0, d);
	float c_shaft = smoothstep(0.01, 0.0, length(p) - r_in * 0.5);
	float c = c_body - c_shaft;;
	return c;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;

	float t = 0.0;
	float t1 = time;
	float t2 = -0.832*time;
	mat2 m1 = mat2(cos(t1), -sin(t1), sin(t1), cos(t1));
	mat2 m2 = mat2(cos(t2), -sin(t2), sin(t2), cos(t2));
	vec2 q1 = m1 * (p - vec2(-0.5, 0.0));
	float g1 = gear(q1, 10.0, 0.4, 0.08); 
	vec2 q2 = m2 * (p - vec2(0.5, 0.0));
	float g2 = gear(q2, 12.0, 0.5, 0.08); 
	
	vec3 col = vec3(0.88, 0.9, 0.64);
	col = mix(col, vec3(length(q1) * 2.0, 0.28 * 1.0, 0.0), g1);
	col = mix(col, vec3(0.0, 0.27, length(q2) * 2.0), g2);
	gl_FragColor = vec4( col, 100.0 );

}