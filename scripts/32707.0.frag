// Customizable effects by @xprogram

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

#define DIVISIONS 10
#define FOLLOW
#define ANIMATE

mat2 rotate(float angle){
	float c = cos(angle);
	float s = sin(angle);

	return mat2(c, -s, s, c);
}

void main(){
	float aspect = resolution.x / resolution.y;

	vec2 p = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
	p.x *= aspect;

	vec2 cur = vec2(0);

	#ifdef FOLLOW
	cur = mouse * 2.0 - 1.0;
	cur.x *= aspect;
	#endif

	#ifdef ANIMATE
	mat2 rot = rotate(mod(time, 360.0));
	p *= rot;
	cur *= rot;
	#endif

	float pi = 3.14159265358979;
	float angle = atan(p.y - cur.y, p.x - cur.x) / pi * 0.5 + 0.5;
	float f = floor(fract(angle * floor(float(DIVISIONS))) + 0.5);
	gl_FragColor = vec4(f);
}