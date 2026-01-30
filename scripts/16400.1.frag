#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float sphere(vec3 p, float r) {
	return length(p) - r;
}

float box(vec3 p, vec3 b) {
	return length(max(abs(p)-b,0.0));
}

float distScene(vec3 p) {
	vec3 offset = vec3(-.5,.1,time);
	p -= offset;
	p.xz = mod(p.xz, 1.0) - vec2(0.5);
	float sp = sphere(p, 0.68);//+0.1*sin(time*3.));
	float bo = box(p, vec3(0.5));
	return max(bo, -sp);
}


void main(void) {
	float aspect_ratio = resolution.x/resolution.y;
	vec2 uv = gl_FragCoord.xy/min(resolution.x, resolution.y);
	uv -= vec2(aspect_ratio/2., .5);
	
	float color = 0.;
	
	vec3 ray_origin = vec3(uv,1);
	float focal = 2.0;
	vec3 ray_direction = normalize(vec3(focal*uv.x, focal*uv.y-.2,-1)); //need normalize!!!!!!!
	
	const int maxiumum_raymarching_steps = 64;
	const float max_dist = 4.;
	float distance_on_ray = 0.;
	float distance_to_scene = 0.;
	for(int steps = 0; steps < maxiumum_raymarching_steps; steps++) {
		vec3 ray_position = ray_origin + distance_on_ray * ray_direction;
		float distance_to_scene = distScene(ray_position);
		if (distance_to_scene < 0.001) {
			color = 1.-float(steps)/float(maxiumum_raymarching_steps);
			break;
		}
		if (distance_on_ray > max_dist) {
			break;
		}
		distance_on_ray += distance_to_scene;
	}

	float gamma = distance_on_ray/4.;
	gl_FragColor = vec4(vec3(pow(color, 1./(gamma*2.))), 1.);
}