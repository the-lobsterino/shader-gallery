// Shader by Nicolas Robert [NRX]

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float Blob (vec2 point1, vec2 point2, float radius) {
	float result = distance (point1, point2);
	if (result >= radius) {
		return 0.0;
	}
	result = 2.0 - result / radius;
	return result * result * result;
}

float BlobAlt (vec2 point1, vec2 point2, float radius) {
	point2 -= point1;
	radius *= radius;
	float result = point2.x * point2.x + point2.y * point2.y;
	if (result >= radius) {
		return 0.0;
	}
	result = 1.0 - sqrt (result / radius);
	return result * result * result;
}

void main (void) {
	vec2 fragment = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
	fragment.x *= resolution.x / resolution.y;
	
	vec2 pointA = vec2 (0.3 * cos (time), 0.3 * sin (time));
	vec2 pointB = vec2 (0.5 * cos (time * 3.0), 0.5 * sin (time * 3.0));
	vec2 pointC = 2.0 * mouse - 1.0;
	pointC.x *= resolution.x / resolution.y;

	float blobValue = BlobAlt (fragment, pointA, 0.6 + 0.04 * sin(time * 5.0));
	blobValue += BlobAlt (fragment, pointB, 0.8 + 0.06 * sin(time * 7.0));
	blobValue += BlobAlt (fragment, pointC, 1.0 + 0.08 * sin(time * 11.0));
	blobValue = smoothstep (0.55, 0.45, blobValue * 2.0);

	if (mod (fragment.x * cos (time * 0.5) + fragment.y * sin (time * 0.5), 0.4) < 0.2) {
		blobValue *= 0.9;
	}
	gl_FragColor = vec4 (blobValue * (0.8 + 0.2 * sin (time)), blobValue * (0.8 + 0.2 * sin (time * 2.0)), blobValue * (0.8 + 0.2 * sin (time * 3.0)), 1.0);
}