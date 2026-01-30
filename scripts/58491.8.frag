#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

vec3 planeIntersect(in float da, in vec3 a, in float db, in vec3 b) {
	return a + da / (da + db) * (b - a);
}

void main( void ) {
	vec3 p0 = vec3(0.500000, 0.125000, 0.500000);
	vec3 p1 = vec3(0.000000, 0.250000, 0.000000);
	vec3 p2 = vec3(0.000000, 0.187500, 0.500000);
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2. - 0.5;
	
	if (position.x < 0. || position.y < 0. || dot(position, vec2(1)) > 1.) {
		gl_FragColor = vec4(.2, .3, .3, 1);
		return;
	}

	float light = 0.;
	
	vec3 n0 = vec3(0.0623, 0.9961, 0.0623);
	vec3 n1 = vec3(-0.0000, 1.0000, -0.0000);
	vec3 n2 = vec3(-0.0000, 0.9991, 0.0416);
	
	vec3 inNormal = n0 + position.x * (n1 - n0) + position.y * (n2 - n0);
	vec3 inWorldPos = p0 + position.x * (p1 - p0) + position.y * (p2 - p0);
	
	for (int i = 0; i < 1; i++) {
		// Inspired by GPU gems 3 Ch12
		const float eps = 1e-4;

		// Make relative to fragment
		vec3 t0 = p0 - inWorldPos;
		vec3 t1 = p1 - inWorldPos;
		vec3 t2 = p2 - inWorldPos;
		vec3 t3 = t2;

		// Clip points of the triangle to the plane of the fragment
		float d0 = dot(t0, inNormal) - eps;
		float d1 = dot(t1, inNormal) - eps;
		float d2 = dot(t2, inNormal) - eps;

		if (abs(d0) < eps) d0 = -eps;
		if (abs(d1) < eps) d1 = -eps;
		if (abs(d2) < eps) d2 = -eps;
		
		// Handle the 8 cases
		if (d0 < 0.0) {
			if (d1 < 0.0) {
				if (d2 < 0.0) {
					// --- (0)
					continue;
				} else {
					// --+ (3)
					t0 = planeIntersect(-d0, t0, d2, t2);
					t1 = planeIntersect(-d1, t1, d2, t2);
					
				}
			} else {
				if (d2 < 0.0) {
					// -+- (3)
					t0 = planeIntersect(-d0, t0, d1, t1);
					t2 = planeIntersect(-d2, t2, d1, t1);
					t3 = t2;
					// Right segment of triangle
				} else {
					// -++ (4)
					t3 = planeIntersect(d2, t2, -d0, t0);
					t0 = planeIntersect(d1, t1, -d0, t0);
					// Left segment
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
			dot(normalize(cross(t0, t1)), inNormal),
			dot(normalize(cross(t1, t2)), inNormal),
			dot(normalize(cross(t2, t3)), inNormal),
			dot(normalize(cross(t3, t0)), inNormal));

		vec4 angles = acos(clamp(vec4(
			dot(t0, t1),
			dot(t1, t2),
			dot(t2, t3),
			dot(t3, t0)), -1.0, 1.0));

		light += clamp(0.5 / 3.1415 * dot(terms, angles), 0.0, 1.0);
	}

	gl_FragColor = vec4( vec3( 1.0 - light ), 1.0 );

}