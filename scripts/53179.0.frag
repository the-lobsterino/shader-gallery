#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
		
	float d = dot(abs(uv), vec2(1));
	d = abs(d - 0.8);
	
	vec3 col = vec3(smoothstep(0.015, 0.0, d));
	gl_FragColor = vec4(col, 1.);
}