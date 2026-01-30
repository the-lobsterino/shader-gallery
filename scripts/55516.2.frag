#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
		
	float d = 1e3;
	float r = 0.1;
	for (float i = 0.; i < 6.28; i += 1.046)
		d = min(d, abs(length(uv - vec2(cos(i), sin(i)) * r) - r));
	col += smoothstep(0.01, 0.0, d);
	
	gl_FragColor = vec4(col, 1.);
}