// Shader by Nicolas Robert [NRX]
//
// Forked from: http://glsl.heroku.com/e#14872.4 (First ray marching test by NRX)
// Original: http://glsl.heroku.com/e#14825.2 (Ray marching by MG - thanks to him!)
//
// Modification of MG's shader by NRX: attempted to optimize the ray marching by avoiding evaluating the distance to each shape at every
// step (see the macro "#define OPTIMIZE"). Also added new shapes and deformation (to check whether it works fine or not), and removed
// the noise used to map the ground, to simplify the experiment. Also, added the possibility to texture each shape by having the local
// coordinates of the intersection point with the ray.
//
// This new version is a debug mode that reports the number of steps used by the ray marching (R component) as well as the number of calls
// to the distance evaluation function (G component). Enabling/disabling the macro "OPTIMIZE" shows how the ray marching behaves...

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAXDIST		50.0
#define DELTA		0.01
#define MAXITER		150
#define M_PI		3.1415926535897932384626433832795
#define OBJ_COUNT	6

#define OPTIMIZE // Faster when enabled: about the same number of ray marching steps, but many less distance evaluations
//#define OPTIMIZE_HACK // To be considered (a bit less steps but more evaluations when enabled...)

int debugCounter1;
int debugCounter2;

mat3 mRotate (in vec3 angle) {
	float c = cos (angle.x);
	float s = sin (angle.x);
	mat3 rx = mat3 (1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);

	c = cos (angle.y);
	s = sin (angle.y);
	mat3 ry = mat3 (c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);

	c = cos (angle.z);
	s = sin (angle.z);
	mat3 rz = mat3 (c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);

	return rz * ry * rx;
}

vec3 vRotateX (in vec3 p, in float angle) {
	float c = cos (angle);
	float s = sin (angle);
	return vec3 (p.x, c * p.y + s * p.z, c * p.z - s * p.y);
}

vec3 vRotateY (in vec3 p, in float angle) {
	float c = cos (angle);
	float s = sin (angle);
	return vec3 (c * p.x - s * p.z, p.y, c * p.z + s * p.x);
}

vec3 vRotateZ (in vec3 p, in float angle) {
	float c = cos (angle);
	float s = sin (angle);
	return vec3 (c * p.x + s * p.y, c * p.y - s * p.x, p.z);
}

float sphere (in vec3 p, in float r) {
	return length (p) - r;
}

float box (in vec3 p, in vec3 b, in float r) {
	vec3 d = abs (p) - b + r;
	return min (max (d.x, max (d.y, d.z)), 0.0) + length (max (d, 0.0)) - r;
}

float planeZ (in vec3 p) {
	return p.z;
}

float torus (in vec3 p, in vec2 t) {
	vec2 q = vec2 (length (p.xy) - t.x, p.z);
	return length (q) - t.y;
}

vec3 twist (in vec3 p, in float k, in float angle) {
	return vRotateY (p, angle + k * p.y);
}

vec4 getDistance(in vec3 p, in int object) {
	++debugCounter2;

	vec4 q;
	if (object == 0) {
		q.xyz = p + vec3 (0.0 , 0.0, sin (time + p.x * 0.5) + sin (p.y * 0.5) + 2.5);
		q.w = planeZ (q.xyz) * 0.8; // we do "dist * K" (with K lower than 1, e.g. 0.8 here) because of the deformation
	}
	else if (object == 1) {
		q.xyz = twist (p + vec3 (-3.0, 0.0, 0.0), cos (time), time);
		q.w = box (q.xyz, vec3 (1.0, 1.0, 1.0), 0.1);
	}
	else if (object == 2) {
		q.xyz = vRotateZ (p + vec3 (0.0, 0.5, 0.0), 0.3);
		q.w = box (q.xyz, vec3 (1.0, 1.0, 1.0), 0.0);
	}
	else if (object == 3) {
		q.xyz = mRotate (vec3 (0.7, 0.0, -0.2)) * (p + vec3 (0.0, 0.5, -2.0));
		q.w = box (q.xyz, vec3 (1.0, 0.5, 1.0), 0.3);
	}
	else if (object == 4) {
		q.xyz = p + vec3 (3.0, -1.0, sin (time * 2.0) - 1.0);
		q.w = sphere (q.xyz, 1.0);
	}
	else if (object == 5) {
		q.xyz = twist (vec3 (p.x + 1.0, p.y - 3.0, p.z), 2.0, 0.0);
		q.w = torus (q.xyz, vec2 (1.0, 0.3)) * 0.5; // we do "dist * K" (with K lower than 1, e.g. 0.5 here) because of the twist
	}
	else {
		q = vec4 (0.0, 0.0, 0.0, MAXDIST);
	}
	return q;
}

int rayMarch (in vec3 origin, in vec3 direction, out vec4 intersection) {
	#ifdef OPTIMIZE
	float distObject [OBJ_COUNT];
	for (int objectIndex = 0; objectIndex < OBJ_COUNT; ++objectIndex) {
		distObject [objectIndex] = 0.0;
	}
	float minDist2 = MAXDIST;
	#endif

	int object;
	vec3 p = origin;
	vec4 q;
	float rayIncrement = MAXDIST;
	float rayLength = 0.0;
	for (int rayStep = 0; rayStep < MAXITER; ++rayStep) {
		++debugCounter1;

		#ifdef OPTIMIZE
		float minDist1 = minDist2;
		minDist2 = MAXDIST;
		for (int objectIndex = 0; objectIndex < OBJ_COUNT; ++objectIndex) {
			float dist = distObject[objectIndex];
			dist -= rayIncrement;
			if (dist < minDist1) {
				q = getDistance (p, objectIndex);
				dist = q.w;
				if (dist < minDist1) {
					minDist2 = minDist1;
					minDist1 = dist;
					object = objectIndex;
					intersection.xyz = q.xyz;
				}
				#ifndef OPTIMIZE_HACK
				else if (dist < minDist2) {
					minDist2 = dist;
				}
				#endif
			}
			distObject[objectIndex] = dist;
		}
		rayIncrement = minDist1;
		#else
		float minDist = MAXDIST;
		for (int objectIndex = 0; objectIndex < OBJ_COUNT; ++objectIndex) {
			q = getDistance (p, objectIndex);
			if (q.w < minDist) {
				minDist = q.w;
				object = objectIndex;
				intersection.xyz = q.xyz;
			}
		}
		rayIncrement = minDist;
		#endif

		rayLength += rayIncrement;
		if (rayIncrement <= DELTA) {
			intersection.w = rayLength;
			return object;
		}
		if (rayLength > MAXDIST) {
			break;
		}
		p = origin + direction * rayLength;
	}
	return -1;
}

void main () {
	debugCounter1 = 0;
	debugCounter2 = 0;

	vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;
	vec3 direction = normalize (vec3 (p.x, p.y, 1.0));

	float angle = time * 0.4;
	vec3 origin = vec3(5.0 * cos (angle), 5.0 * sin (angle), 2.5);
	direction = mRotate (vec3 (M_PI / 2.0 + 0.45, 0.0, angle - M_PI / 2.0)) * direction;

	vec4 intersection;
	rayMarch (origin, direction, intersection);

	gl_FragColor = vec4 (float (debugCounter1) / 50.0, float (debugCounter2) / (float (OBJ_COUNT) * 50.0), 0.0, 1.0);
}