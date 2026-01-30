// @machine_shaman

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define S(d) ((.005 / length(d)) + smoothstep(0.01, 0.0, d - 0.01))
void main() {

	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
	
	col += S(length(uv));
	float m = 6.28 / 18.;
	for (int i = 0; i < 4; i++) {
		float l = length(uv);
		float a = atan(uv.y, uv.x);
		a = mod(a, m) - m / 2.0;
		uv = vec2(cos(a), sin(a)) * l - vec2(0.2, 0.);
		col += S(length(uv));
	}
	
	
	
	gl_FragColor = vec4(col, 1.);

}