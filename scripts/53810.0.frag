#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float grid(vec2 p, float N) 
{
	p = p * N;
	p.x = 0.86602*p.x + floor(p.y) * 0.5; 
	p = fract(p);
	
	p.x = abs(.5 - p.x);
	float a = max(p.x * 2. + p.y, 1. - p.y * 1.5);
	float tri = step(p.x * 2. + p.y, 1.);
	
	p.x = .5 - p.x; 
	p.y = 1. - p.y;
	float b = max(p.x * 2. + p.y, 1. - p.y * 1.);
	
	return mix(1.0 - b, 1.0 - a, tri) / .6;
}

float map(vec2 uv) {
	float s = 1.;
	return grid(uv, 1.);
}

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
	
	uv *= 5.;
	float m = map(uv);
	
	vec2 o = vec2(.01, 0.);
	vec3 n = normalize(vec3(m - map(uv + o.xy),
				m - map(uv + o.yx), -o.x));
	
	vec3 l = normalize(vec3(cos(time * 1.2), 1. + sin(time * .5), -1.1));
	vec3 v = normalize(vec3(uv, 1.0));
	
	float diff = max(dot(n, l), 0.);
	float spec = pow(max(dot(n, normalize(l-v)), 0.), 8.);
	

	col += m * .5;
	col += vec3(.2, 0., .2) * diff * .5;
	col += vec3(0., 1., 1.) * spec * .5;
	

	gl_FragColor = vec4(col, 1.);
}