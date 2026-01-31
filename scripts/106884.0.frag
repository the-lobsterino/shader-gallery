#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14;
const float PERIOD = 30.0;

float wave(vec2 c, vec2 p, float speed, vec2 shift){
	vec2 v = p - c;
	v.x += sin(time*speed)*shift.x;
	v.y += cos(time*speed)*shift.y;
	float r = length(v);
	
	return sin(r*PI*PERIOD*2.0+time*speed);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	float ratio = resolution.y / resolution.x;
	p.y *= ratio;
	vec2 c1 = vec2(7.5* ratio);
	vec2 c2 = vec2(0.5, 0.5 * ratio);
	vec2 c3 = vec2(0.5, 0.5 * ratio);

	gl_FragColor = vec4(wave(c1, p, 3.0, vec2(0.06)), wave(c2, p, 1.5, vec2(0.1)), wave(c3, p, 3.9, vec2(0.08)), 1.0 );

}