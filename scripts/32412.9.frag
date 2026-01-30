#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define sphere length(p) - 1.
#define sphere2 length(p+vec3(2.)) - 1.
const float EPSILON = 0.001;
const float MAX_DIST = 20.0;

float scene(vec3 p) {
	return min(min(min(sphere,1.),-p.z),min(sphere2,1.));	
}

vec3 normal(vec3 p, float t){
	vec3 eps = vec3(EPSILON,0.,0.);
	vec3 eps2 = vec3(-EPSILON,0.,0.);
	return normalize(
		vec3(scene(p+eps.xyz) - scene(p+eps2.xyz), 
		     scene(p+eps.yxz) - scene(p+eps2.xyz), 
		     scene(p+eps.yzx) - scene(p+eps2.xyz))
	);
}



vec4 render(float t) {
	vec3 pos = vec3(0,0,-7);
	vec3 rayDir = normalize(vec3((gl_FragCoord.xy - resolution.xy * .5) / resolution.x, .5));

	// Raytrace loop
	
	float totalDist = 0.;
	
	for(int i = 0; i < 30000; i++) {
		// Evalulate the distance at the current point
		float dist = scene(pos); 
		// Advance the point forwards in the ray direction by the distance
		pos += dist*rayDir;
		totalDist += dist;
		if (dist < EPSILON || totalDist > MAX_DIST) break;
	}
	
	vec3 nrm = normal(pos, t);
	return vec4(vec3(0.0,1.,0.)/totalDist*(2.+nrm.y), 1.);
}

void main(void) {
	gl_FragColor = render(time);
}