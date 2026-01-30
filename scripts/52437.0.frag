#ifdef GL_ES 
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 gen_color(vec2 frag, float t) {
	vec3 color = vec3(0);
	vec3 rd = vec3(frag, sin(t * 0.01));
		
	float s = abs(sin(t*0.25));
	for (int i = 0; i < 11; i++) {
		rd = abs(rd) / dot(rd, rd);
        rd -= s;
		color.rgb += rd;
	}
	color *= 0.08 + tan(t * 1.0) * 0.04;
	return color;
}

void main() {
	vec2 uv = (gl_FragCoord.xy/resolution - 0.5) * 4.;//1.2*(2. * gl_FragCoord.xy - resolution) / resolution.y;
	float s = sin(time*0.25);
	float c = cos(time*0.25);
	uv = reflect(uv, vec2(s, c));
	vec3 d = gen_color(uv, time);
	vec3 e = gen_color(uv, time+2.);
	vec3 f = gen_color(uv, time+6.);
	vec3 g = reflect(d, e);
	vec3 final = reflect(g, f);
	gl_FragColor = vec4(final, 1.);
}