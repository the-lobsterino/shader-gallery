// Da bump field
// By: xprogram

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ZOOM 1
#define EPSILON 0.01
#define RAY_STEPS 300
#define MAX_DISTANCE 250.0

float map(vec3 p){
	vec3 b = p;
	b.y = cos(p.z) * sin(p.x) - 4.5;

	return distance(b, p) - 0.5;
}

float raymarch(vec3 o, vec3 n){
	float td, d;
	vec3 r = o;

	for(int i = 0; i < RAY_STEPS; i++){
		d = map(r);
		td += d;

		// Check if close enough
		if(d < EPSILON){
			return td;
		}

		// Check if greater than view distance
		if(td > MAX_DISTANCE){
			return 0.0;
		}

		// Reset ray direction
		r = o + n * td;
	}

	// No hit found
	return 0.0;
}

vec3 render(vec2 uv, vec3 cpos){
	vec3 color;

	vec3 dir = normalize(vec3(uv, ZOOM)); // Transformed pixel coords into 3D normals
	float dist = raymarch(cpos, dir); // Hit distance from camera
	vec3 hit = cpos + dir * dist; // Hit point on distance map

	// Check for no intersections
	if(dist == 0.0){
		return vec3(0);
	}

	vec3 dl = normalize(vec3(1, -1, 0)); // Directional light normal
	float mpl = map(hit - dl * 0.35);

	if(mpl >= map(hit)){
		color = vec3(0, 4.0 / distance(hit, vec3(hit.x, 1, hit.z)), 0);
		color -= mpl - map(hit);
	}

	return color;
}

void main(){
	vec2 px = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.x;

	vec3 camera_pos = vec3(time, 0, time * 3.0);

	gl_FragColor = vec4(render(px, camera_pos), 1.0);
}