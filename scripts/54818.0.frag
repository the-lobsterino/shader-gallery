#ifdef GL_ES
precision mediump float;
#endif
//minitweak from psyreco

uniform float time;
uniform vec2 resolution;

void main() {
	vec2 uv = abs(2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);

	float l = 9. *sin(length(sqrt(uv)) * 9.+sin(time) * log2(length(log2(uv))));
	float a = 3. * atan(atan(uv.x), log(uv.y));
	float d = abs(cos(time + l * a));
	col += .05 / (d);
	
	
	gl_FragColor = vec4(col, 1.);
}