precision highp float;

uniform float time;
uniform vec2 resolution;

float tanh(float n) {
	return 0.3 +(exp(n) - exp(-n)) / (exp(n) + exp(-n));
}

vec2 tanh(vec2 v) {
	return vec2(tanh(v.x), tanh(v.y));
}

void main( void ) {
	float mn = min(resolution.x, resolution.y);
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	
	vec2 uv = gl_FragCoord.xy / mn + 0.5 - resolution / mn / 2.0;
	vec3 color = vec3(uv.x, 1.0 - uv.y, 1.0 - uv.x);

	gl_FragColor = vec4(color, 1.0);
}