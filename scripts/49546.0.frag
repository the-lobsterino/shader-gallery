#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float n){return fract(sin(n) * 43758.5453123);}

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy) * 2. - 1.;
	p.x *= resolution.x / resolution.y;
	
	float rot = time;
	p *= mat2(cos(rot), sin(rot), -sin(rot), cos(rot));
	
	float d = length(p);
	float a = atan(p.y, p.x);
	float r = sin(a * (sin(time) * 4. + 7.)) + rand(a);
	r *= 0.5;
	float b = 0.27 + abs(sin(time));
	float f = smoothstep(r - b, r, d) - smoothstep(r, r / b, d);
	
	gl_FragColor = vec4(vec3(d / f), 1.);

}