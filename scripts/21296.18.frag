#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
//uniform vec2 resolution;
varying vec2 surfacePosition;

#define randomness_details 4
vec3 seed = vec3(13, 5,43758.5453);

//randomness perlin noise
float rand(vec2 n) { 
	return fract(sin(dot(n, seed.xy)) * seed.z);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y)*0.25;
}

float fbm(vec2 n) {
	float total = 0.0, amplitude = 1.0;
	for (int i = 0; i < randomness_details; i++) {
		total += noise(n) * amplitude;
		n += n;
		amplitude *= 0.5;
	}
	return total*2.0;
}


void main() {
	
	vec2 p = surfacePosition; 
	//vec2 m = mouse-0.5;
	vec3 col = vec3(0);
	
	col.r = fbm(p*10.+time*vec2(-1,1));
	seed = vec3(21,291,4234);
	col.g = fbm(p*10.+time*vec2(1,2));
	seed = vec3(-13,17,-234);
	//col.b = fbm(p*10.+time*vec2(1,-1)); //wont save with 3 noise generators active
	
	
	gl_FragColor = vec4( col, 1. );
}