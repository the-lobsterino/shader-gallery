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
	result = 1.0 - result / radius;
	return result * result;
}

void main (void) {
	vec2 fragment = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
	fragment.x *= resolution.x / resolution.y;
	
	vec2 pointA = vec2 (0.3 * cos (time), 0.3 * sin (time));
	vec2 pointB = vec2 (0.4 * cos (time * 1.5), 0.4 * sin (time * 1.5));
	vec2 pointC = vec2 (0.5 * cos (time * .1) + .5, 0.5 * sin (time * -.1));
	vec2 pointM = 2.0 * mouse - 1.0;
	pointM.x *= resolution.x / resolution.y;

	float blobValue = Blob (fragment, pointA, 0.3);
	blobValue += Blob (fragment, pointB, 0.2);
	blobValue += Blob (fragment, pointC, 0.9);
	blobValue += Blob (fragment, pointM, 0.2);
	
	blobValue = smoothstep (0.70, 0.69, blobValue * 3.0);

	gl_FragColor = vec4 (blobValue, blobValue, blobValue , 1.0);
}