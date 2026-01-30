#ifdef GL_ES
precision mediump float;
#endif

#define ITERATIONS 40
#define EPS 0.001
#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ball(vec3 point, vec3 pos, float size) {
	return max(0., distance(point, pos) - size);	
}

float field(vec3 pos) {
	return ball(pos, vec3(0.,0.,2.), 1.);
}


int march(vec2 screenpos, float fov) {
	vec3 camera = vec3(0.);
	
	float zdist = tan( PI/2. - (fov * PI/360.));
	
	vec3 ray = normalize(vec3(screenpos, zdist) - camera);
	
	vec3 point = camera;
	
	
	for (int i = 0 ; i < ITERATIONS ; i++) {
		float curdist = field(point);
		
		if (curdist < EPS) {
			return i;
		} else {
			point += ray*curdist;	
		}
	}
	
	return 0;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position = position * 2. - 1.;
	position.x *= resolution.x / resolution.y;
	
	int iters = march(position, 90.);
	float reliters = float(iters) / float(ITERATIONS);
	
	gl_FragColor = vec4(reliters);
}