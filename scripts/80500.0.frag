#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float line(vec2 p, vec2 p1, vec2 p2) {
	float d = -length(p1-p2)+length(p-p1)+length(p-p2)-1.;
	return pow(-d, 1e4);
}

void main() {
	vec2 p = gl_FragCoord.xy/resolution.xy;
	vec3 c = vec3(9.);
	float cc = 0.;
	
	cc = line(p, mouse, vec2(.5,.5));
	
	c = vec3(cc);
	//c = fract(c+vec3(fract(a)+fract(r)));
	gl_FragColor = vec4(c,1);
}