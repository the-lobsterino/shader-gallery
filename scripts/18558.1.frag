#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main() {	
	vec2 uv = (gl_FragCoord.xy/resolution.xy)-.5;

	float si = sin(time+length(uv)*300.);
	float co = cos(time+length(uv)*304.);
	mat2 ma = mat2(co, si, -si, co);

	uv.xy *= ma;
	
	
	float c = clamp(uv.y*32., 0., 1.);
	gl_FragColor=vec4(c, c*.7, 0., 1.0);
}