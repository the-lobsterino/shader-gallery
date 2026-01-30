// i dunno lol ¯\(°_o)/¯ 

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 BELT_COLOR = vec3(.4);

float rand(float n){return fract(sin(n) * 43758.5453123);}

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(float p){
	float fl = floor(p);
  float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}
	
float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

vec2 beltUV(vec2 screenUV) {
	return fract(screenUV * vec2(10., 5.));
}

vec3 belt(vec2 uv) {
	vec2 buv = vec2(fract(uv.x * 2.), uv.y);
	float shade = ((1. - (dot(buv - vec2(0.1, 0.5), buv - vec2(0.1, 0.5)) * 0.6)));
	shade = max(step(0.25, buv.y) * step(buv.y, 0.75), shade);
	shade *= ((smoothstep(0., 1., buv.x) * 0.2) + 0.8);
	
	vec2 pos = vec2(0.7 - 0.4 * cos(uv.y * 2. * 3.14), 0.5);
	vec2 scale = vec2(4., 1.);
	vec3 yellow = step(0.95, (1. - dot(uv * scale - pos, uv * scale - pos))) * vec3(1., 1., 0.);
	
	return BELT_COLOR * shade + yellow;
}

vec3 ground(vec2 uv) {
	vec2 scale = 60. * vec2(2., 1.);
	vec3 color = vec3(0.35, 0.2, 0.1) * ((noise(uv * scale) * 0.2) + 0.8);
	return color;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy / resolution.xy);
	vec3 g = ground(uv);
	uv.x -= sin(time) * noise(time);
	vec3 c = belt(beltUV(uv * vec2(1.)));
	c = mix(g, c, step(0.4, uv.y) * step(uv.y, 0.6));
	c *= smoothstep(0., 0.5, uv.y) * 0.2 + 0.8;
	gl_FragColor = vec4(c, 1.0);
}