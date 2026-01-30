#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 planeIntersect(in float da, in vec3 a, in float db, in vec3 b) {
	const float eps = 1e-4;

	return a + da / (da + db + eps) * (b - a);
}

void main( void ) {
	gl_FragColor = vec4(0, 0, 0, 1);
	
	vec2 pos2 = gl_FragCoord.xy / resolution.xy;
	vec3 p = pos2.x * vec3(1, 0, .1) + pos2.y * vec3(.1, 1, 0);

		// Inspired by GPU gems 3 Ch12
	
	vec3 n = vec3(-.1, .01, 1);
	
	// Make relative to fragment
	vec3 t0 = vec3(.28, .8, .02) - p;
	vec3 t1 = vec3(.22, .2, .02) - p;
	vec3 t2 = vec3(.85, .5, .08) - p;
	
	vec3 t3 = t2;

	// Clip points of the triangle to the plane of the fragment
	float d0 = dot(t0, n);
	float d1 = dot(t1, n);
	float d2 = dot(t2, n);
	
	

	// Handle the 8 cases
	if (d0 < 0.0) {
		if (d1 < 0.0) {
			if (d2 < 0.0) {
				// --- (0)
				discard;
			} else {
				// --+ (3)
				t0 = planeIntersect(-d0, t0, d2, t2);
				t1 = planeIntersect(-d1, t1, d2, t2);
			}
		} else {
			if (d2 < 0.0) {
				// -+- (3)
				t0 = planeIntersect(-d0, t0, d1, t1);
				t1 = planeIntersect(-d2, t2, d1, t1);
			} else {
				// -++ (4)
				t3 = planeIntersect(d2, t2, -d0, t0);
				t0 = planeIntersect(d1, t1, -d0, t0);
			}
		}
	} else {
		if (d1 < 0.0) {
			if (d2 < 0.0) {
				// +-- (3)
				
				t1 = planeIntersect(-d1, t1, d0, t0);
				t2 = planeIntersect(-d2, t2, d0, t0);
				t3 = t2;
			} else {
				
				// +-+ (4)
				t3 = t0;
				t0 = planeIntersect(d0, t0, -d1, t1);
				t1 = planeIntersect(d2, t2, -d1, t1);
			}
		} else {
			if (d2 < 0.0) {
				
				// ++- (4)
				t3 = planeIntersect(d0, t0, -d2, t2);
				t2 = planeIntersect(d1, t1, -d2, t2);
			} else {
				
				// +++ (3)
			}
		}
	}

	t0 = normalize(t0);
	t1 = normalize(t1);
	t2 = normalize(t2);
	t3 = normalize(t3);

	// The cross products of the three component vectors
	vec4 terms = vec4(
		dot(normalize(cross(t0, t1)), n),
		dot(normalize(cross(t1, t2)), n),
		dot(normalize(cross(t2, t3)), n),
		dot(normalize(cross(t3, t0)), n));

	vec4 angles = acos(clamp(vec4(
		dot(t0, t1),
		dot(t1, t2),
		dot(t2, t3),
		dot(t3, t0)), -1., 1.));
	
	float color = clamp(0.5 / 3.1415 * dot(terms, angles), 0., 1.);

	gl_FragColor.rgb = vec3(color);
}
