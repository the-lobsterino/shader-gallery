#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

const float PI = 3.14159265358979323844;

const float INFINITY = 1e6;

// Make box.
bool intersects(vec3 rayOrigin, vec3 rayDirection, vec3 boxCenter, float boxSize, out float t_intersection) {
	vec3 t1 = (boxCenter - vec3(boxSize) - rayOrigin) / rayDirection;
	vec3 t2 = (boxCenter + vec3(boxSize) - rayOrigin) / rayDirection;

	vec3 t_min = min(t1, t2);
	vec3 t_max = max(t1, t2);
	
	float t_near = max(t_min.x, max(t_min.y, t_min.z));
	float t_far = min(t_max.x, min(t_max.y, t_max.z));
	
	if (t_near > t_far || t_far < 0.0) {
		return false;
	}
	
	t_intersection = t_near;
	
	return true;
}

mat3 camera(vec3 rayOrigin, vec3 la) {
	vec3 roll = vec3(0, 1, 0);
	vec3 f = normalize(la - rayOrigin);
	vec3 r = normalize(cross(roll, f));
	vec3 u = normalize(cross(f, r));
	
	return mat3(r, u, f);
}

mat3 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat3(
	    oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
	    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
	    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c
    );
}

void main(void) {
	vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);  // -1.0 ~ 1.0
	
	float angle = 0.25 * time * 2.0 * PI;
	
	// This is for changing camera angle.
	float scale = 8.0;
	
	vec3 rayOrigin = scale * vec3(cos(angle), 1.0, -sin(angle));  // Like a camera angle.
	vec3 rayDirection = camera(rayOrigin, vec3(0.0, 0.0, 0.0)) * normalize(vec3(uv, 2.0));
	
	// Fixed camera position
	//rayOrigin = vec3(0.0, 0.0, -12.0);
	//rayDirection = vec3(uv, 1.0);
	
	float t_intersection = INFINITY;
	
	const float cluster_size = 3.0;
	float inside = 0.0;

	for (float i = 0.0; i < cluster_size; i++) {
		for (float j = 0.0; j < cluster_size; j++) {
			for (float k = 0.0; k < cluster_size; k++) {
				float lastIndex = cluster_size - 1.0;
				float margin = 1.5;
				vec3 boxCenter = (vec3(i, j, k) * 2.0 - vec3(lastIndex)) / lastIndex;  // -1.0 ~ 1.0
				boxCenter *= margin;
				float l = length(boxCenter);
				
				float minSize = 0.1;
				float maxSize = 0.4;
				float sizeOffset = abs(sin(time * l));
				float size = minSize + maxSize * sizeOffset;
				
				float t = 0.1;  // This value affects t_intersection via intersects() method.
				
				//vec3 rayOrigin = scale * vec3(cos(angle), 1.0, -sin(angle));
				//vec3 rayDirection = camera(rayOrigin, boxCenter) * normalize(vec3(uv, 2.0));

				if (intersects(rayOrigin, rayDirection, boxCenter, size, t) && t < t_intersection) {
					t_intersection = t;
					
					vec3 n = rayOrigin + rayDirection * t_intersection - boxCenter;
					
					const float STROKE_BOLD = 0.1;
					
					vec3 normal = smoothstep(vec3(size - STROKE_BOLD), vec3(size), n) + smoothstep(vec3(size - STROKE_BOLD), vec3(size), -n);
					
					inside = smoothstep(1.5, 2.0, normal.x + normal.y + normal.z);
				}
			}
		}
	}
	
	if (t_intersection == INFINITY) {
		// Background
		gl_FragColor = mix(vec4(0.5, 0.5, 0.5, 1.0), vec4(0.0), 0.5 * length(uv));
	} else {
		// Boxes
		gl_FragColor = inside * vec4(1.0, 1.0, 0.0, 1.0);
	}
}
