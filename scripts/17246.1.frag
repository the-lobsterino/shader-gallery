// Shader by Nicolas Robert [NRX]
// Latest version: http://glsl.heroku.com/e#17246

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define DELTA		0.01
#define RAY_LENGTH_MAX	1000.0
#define RAY_STEP_MAX	50
#define FADE_POWER	3.0
#define M_PI		3.1415926535897932384626433832795

void main () {

	// Define the ray corresponding to this fragment
	vec2 frag = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;
	vec3 direction = normalize (vec3 (frag, 2.0));

	// Set the camera
	float radius = 120.0 + 60.0 * sin (time * 0.3);
	vec3 origin =  vec3 (radius * cos (time), radius * sin (time), time * 40.0);
	vec3 forward = vec3 (-origin.x, -origin.y, 200.0 * sin (time * 0.5));
	vec3 up = vec3 (0.0, 1.0, 0.0);
	mat3 rotation;
	rotation [2] = normalize (forward);
	rotation [0] = normalize (cross (up, forward));
	rotation [1] = cross (rotation [2], rotation [0]);
	direction = rotation * direction;

	// Ray marching
	vec3 p = origin;
	vec3 q;
	float dist;
	float rayLength = 0.0;
	for (int rayStep = 0; rayStep < RAY_STEP_MAX; ++rayStep) {
		q = p + vec3 (4.0 * sin (p.z * 0.1), 10.0 * sin (p.z * 0.05) * sin (p.z * 0.01), 0.0);
		dist = length (q.xy) - (20.0 + 15.0 * cos (p.z * 0.005));
		rayLength += dist;
		if (dist < DELTA || rayLength > RAY_LENGTH_MAX) {
			break;
		}
		p += direction * dist;
	}

	// Compute the fragment color
	vec3 color;
	if (dist < DELTA) {
		float angle = atan (q.y, q.x);
		color = 0.5 + 0.5 * vec3 (sin (q.z * 0.4), sin (angle * 4.0), sin (q.z * 0.2) * sin (angle * 8.0));
		color *= 0.5 + 0.5 * vec3 (sin (q.z * 0.05), sin (q.z * 0.07), sin (q.z * 0.03));
		color += max (0.0, sin (q.z * 0.03 - time * 3.0) - 0.95) * 10.0;
		color *= pow (1.0 - rayLength / RAY_LENGTH_MAX, FADE_POWER);
	} else {
		color = vec3 (0.0);
	}

	// Set the fragment color
	gl_FragColor = vec4 (color, 1.0);
}