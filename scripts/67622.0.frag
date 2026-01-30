#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_DEPTH 100
#define EPS 0.0001

float distance_to_plane(vec3 sample, float height) {
	return max(0.0, sample.y - height);
}

float distance_to_sphere(vec3 sample, vec3 spos, float ssize) {
	return max(0.0, distance(sample, spos) - ssize);
}

vec4 trace_background(vec3 pos, vec3 dir) {
	float depth = 0.0;

	for (int i = 0 ; i < MAX_DEPTH ; i++) {
		float dist = distance_to_plane(pos, -1.0);
		depth += dist;
		
		if (dist < EPS) {
			if (mod(pos.x, 1.0) + mod(pos.z, 1.0) < 1.0) {
				return vec4(0.8, 0.8, 0.8, depth);
			} else {
				return vec4(0.5, 0.5, 0.5, depth);
			}
		} else {
			pos += (dir * dist);
		}
	}

	return vec4(0, 0, 0, 99999);
}

vec4 trace_spheres(vec3 pos, vec3 dir) {
	float depth = 0.0;

	for (int i = 0 ; i < MAX_DEPTH ; i++) {
		float dist = distance_to_sphere(pos, vec3(tan(sin(time))*0.7, tan(cos(time))*0.4, -5), 0.7);
		depth += dist;
		
		if (dist <= EPS) {
			return vec4(0.8, 0.2, 0.2, depth);
		} else {
			pos += (dir * dist);
		}
	}

	return vec4(0, 0, 0, 99999);	
}

vec4 sample_distancefield(vec3 pos, vec3 dir) {
	vec4 back = trace_background(pos, dir);
	vec4 spheres = trace_spheres(pos, dir);
	
	if (spheres.w < back.w) {
		return spheres;
	} else {
		return back;
	}
}

vec3 lighting(vec3 pos, vec3 lamp_pos, vec3 color) {
	vec3 light_dir = normalize(pos - lamp_pos);
	vec4 light = sample_distancefield(lamp_pos, light_dir);
	vec3 light_pos = lamp_pos + (light.w - EPS) * light_dir;

	if (distance(light_pos, pos) < 0.001) {
		return color;
	} else {
		return vec3(0);
	}

}
		
vec3 render(vec3 pos, vec3 dir) {
	vec4 diffuse = sample_distancefield(pos, dir);
	
	// nothing hit we return 0
	if (diffuse.w > 999.0) {
		return vec3(0);
	}

	// This is the point we hit the diffuse
	vec3 diffuse_pos = pos + (diffuse.w - EPS) * dir;

	// Calculate if it is lit
	return 
		0.25*lighting(diffuse_pos, vec3(-8, 10, 10), diffuse.xyz) +
		0.25*lighting(diffuse_pos, vec3(-12, 10, 10), diffuse.xyz) + 
		0.25*lighting(diffuse_pos, vec3(-10, 10, 8), diffuse.xyz) + 
		0.25*lighting(diffuse_pos, vec3(-10, 10, 12), diffuse.xyz);
}

void main( void ) {	
	vec3 camera = vec3(0, 0, 0);
	
	vec3 forward = vec3(0, 0, -1);
	vec3 up = vec3(0, 1, 0);
	vec3 right = cross(forward, up);
	
	float ratio =  (resolution.x/resolution.y);
	vec2 fragPos = (gl_FragCoord.xy / resolution.xy) * vec2(ratio, 1.0) - vec2(0.5* ratio, 0.5);
	
	vec3 view_dir = normalize(forward + up * fragPos.y + right * fragPos.x);
	
	vec3 color = render(camera, view_dir);
	gl_FragColor = vec4(color, 1.0);

}