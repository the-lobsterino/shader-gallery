#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAXITER 100
#define DELTA 0.001
#define SPEED 50.0
#define MAXDIST 100.0

// Procedural Geometry Concept for VRRunner by Jaksa

float noise(float x) {
	return fract(sin(dot(vec2(x), vec2(12.9898, 78.233)))* 43758.5453);
}

float cube(vec3 p) {
	vec3 center = vec3(0,-5,10);
	vec3 dist = abs(p - center) - 3.0;
	dist.y = p.y - center.y;
	return max(dist.x, max(dist.y, dist.z));
}

float cubes(vec3 p) {
	float section = floor(p.z/10.0);
	
	p.z = mod(p.z, 10.0);
	
	p.y += noise(section+3.0)*10.0;
	p.x += noise(section)*50.0-25.0;
	
	return min(7.0, cube(p));
}

float scene(vec3 p) {	
	return min(cubes(p), 60.0 + p.y);
}

void main( void ) {
	vec2 p2d = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	p2d.x *= resolution.x/resolution.y;

	vec3 ro = vec3(0,0,time*SPEED);
	vec3 rd = normalize(vec3(p2d, 1.0));
	
	vec3 p = ro;
	float dist = 0.0;
	for (int i = 0; i < MAXITER; i++) {
		float d = scene(p);
		if (d < DELTA) break;
		if (d > MAXDIST) break;
		p += d*rd;
		dist += d;
	}
			
	gl_FragColor = vec4(vec3(dist*.007), 1.0);
}