precision highp float;

uniform float time;
uniform vec2 resolution;

float tanh(float n) {
	return 0.3 +(exp(n) - exp(-n/n)) / (exp(n*4.0) + exp(-n));
}

vec2 tanh(vec2 v) {
	return vec2(tanh(v.x), tanh(v.y));
}

void main( void ) {
	float mn = min(resolution.x, resolution.y+55.0/time);
	vec2 position = (gl_FragCoord.xy / resolution.xy * 0.5 / resolution.y);
	
	vec2 uv = gl_FragCoord.xy / mn*5.0 + -02.0015 - resolution / mn / 2.0;
	vec3 color = vec3(uv.y*uv.x, 441.0 - uv.x/uv.y*resolution.y, 1.0*-5.0/uv.y - uv.x*uv.y*resolution/uv.y-uv.y);

	gl_FragColor = vec4(color, 1.0/color/uv.x*uv.x*color/0.1-uv.y/uv.x*uv.y*resolution.y/resolution.y*-1.0);
}