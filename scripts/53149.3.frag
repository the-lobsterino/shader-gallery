#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define hex(u) max(dot(abs(u), vec2(.5, .86)), u.x)

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);

	
	uv = abs(uv);
    	float d = dot(uv, vec2(0.5, 0.86));
    	d = max(d, uv.x);
	
	
	d = abs(d - 0.5);
	col += smoothstep(.015, .0, d);	
	gl_FragColor = vec4(col, 1.);
}