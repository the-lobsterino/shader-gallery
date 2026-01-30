#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

/* 
 * Visualizing spherical harmonics, as in atomic orbitals. See:
 * <http://ppsloan.org/publications/StupidSH36.pdf>
 */

#define PI 3.1415

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float P_2_0(vec3 pos) {
// K_2^0 = sqrt(5)/(4*sqrt(pi)) /approx 0.315391565252
	float K_2_0 = 0.315391565252;
	return K_2_0 * ( 3.0*pos.z*pos.z - 1.0);
}

float P_2_1(vec3 pos) {
// K_2^1 = -sqrt(15)/(2*sqrt(pi)) /approx -1.09254843059
	float K_2_1 = -1.09254843059;
	return K_2_1 * pos.x * pos.z;
}

float P_3_n1(vec3 pos) {
// K_3^{-1} = -sqrt(2)sqrt(21)/(8*sqrt(pi)) /approx -0.457045799462
	float K_3_n1 = -0.457045799462;
	/* Why is this not a homogeneous polynomial? */
	return K_3_n1 * pos.y * (-1.0 + 5.0 * pos.z * pos.z);
}

vec3 rotate_x(vec3 pos, float angle) {
	mat3 rot = mat3(
		1.0, 0.0, 0.0,
		0.0, cos(angle), -sin(angle),
		0.0, sin(angle), cos(angle));
	return rot * pos;
}

vec3 rotate_y(vec3 pos, float angle) {
	mat3 rot = mat3(
		cos(angle), 0.0, sin(angle),
		0.0, 1.0, 0.0,
		-sin(angle), 0.0, cos(angle));
	return rot * pos;
}

float sphericalHarmonic(vec3 pos) {
	/* Calculate theta, phi, and r for this point */
	float r = length(pos - vec3(0.0));
	float phi = atan(pos.y, pos.x);
	float theta = acos(pos.z / r);
	
	
	float result = P_2_0(vec3(
		sin(theta) * cos(phi),
		sin(theta) * sin(phi),
		cos(theta)
	)) * cos(theta);
	
	
	/*
	float result = sqrt(2.0) * cos(1.0 * phi) * cos(theta)
		* P_2_1(vec3(
			sin(theta) * cos(phi),
		        sin(theta) * sin(phi),
		        cos(theta)
		  ));
	*/
/*	
	float result = sqrt(2.0) * sin(1.0 * phi) * cos(theta)
		* P_3_n1(vec3(
			sin(theta) * cos(phi),
		        sin(theta) * sin(phi),
		        cos(theta)
		  ));
	*/
	return length(pos) - (result * result + 0.13);
}

float sphere(vec3 pos, float radius) {
	return length(pos) - radius;
}

float distanceField(vec3 pos) {
	return sphericalHarmonic(
		rotate_y(
		rotate_x(
		pos - vec3(0.0, 0.0, -1.2),
		mouse.y * 10.0),
		mouse.x * 10.0)
	);
}

vec3 surfaceNormal(vec3 pos) {
	/* Estimate the gradiant at this position */
	float delta = 0.05;
	float d = distanceField(pos);
	vec3 gradiant = vec3(
		distanceField(pos + vec3(delta, 0.0, 0.0)) - d,
		distanceField(pos + vec3(0.0, delta, 0.0)) - d,
		distanceField(pos + vec3(0.0, 0.0, delta)) - d);
	return normalize(gradiant);
}

void main( void ) {
	float focalLength = 1.0;
	vec3 pos = vec3(( gl_FragCoord.xy * 2.0 - resolution ) / (resolution.y * 2.9), 0.0);
	vec3 dir = normalize(pos - vec3(0.0, 0.0, focalLength));
	
	vec3 directionalLight = normalize(vec3(1.0, 1.0, 1.0));

	/* Loop for ray marching */
	vec3 color = vec3(1.0);
	float epsilon = 0.1;
	float fudge = 0.1;  /* Fudge factor, since our distance field does not actually
                               represent distance to the surface */
	for (float i = 0.0; i < 64.0; i += 1.0) {
		float d = distanceField(pos);
		if (abs(d) <= epsilon) {
			/* We are close enough to the surface to reflect */
			/* TODO: Actually reflect */
			color = vec3(1.0, d * (1.0 / epsilon), 0.5);
			color = vec3(max(dot(directionalLight, surfaceNormal(pos)), 0.0));
			break;
		}
		pos += dir * d * fudge;
	}
	

	gl_FragColor = vec4( color, 1.0 );

}