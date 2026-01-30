#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(float n) {
	return fract(sin(n)*43758.4545);
}

float noise(vec2 x) {
	vec2 p = floor(x);
	vec2 f = fract(x);
	
	f = smoothstep(0.0, 1.0, f);
	
	float n = p.x + p.y*57.0;
	
	return mix(
		mix(hash(n + 00.0), hash(n + 01.0), f.x),
		mix(hash(n + 57.0), hash(n + 58.0), f.x),
		f.y);
}

float fbm(vec2 p) {
	float f = 0.0;
	
	f += 0.500*noise(p); p *= 2.01;
	f += 0.250*noise(p); p *= 2.04;
	f += 0.125*noise(p);
	
	f /= 0.875;
	
	return f;
}

void main( void ) {
	vec2 uv = (-1.0 + 2.0*(gl_FragCoord.xy/resolution))*vec2(resolution.x/resolution.y, 1);
	
	uv.x -= cos(time);
	
	vec3 col = mix(vec3(0.2, 0.6, 1), vec3(1, .97, .1), 1.0 - smoothstep(0.3, 0.4, length(uv)));
	vec2 p = uv;
	uv.x += cos(time);
	float f = smoothstep(0.4, 1.0, 2.0*fbm(2.0*uv + time));
	col = mix(col, vec3(1), f);
	col = mix(col, vec3(1, .97, .1), (1.0 - smoothstep(0.0, 0.4, length(p))));
	
	gl_FragColor = vec4(col, 1);
}