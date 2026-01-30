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
	
	float a, blobValue;
	float b = 0.1;
	
	for (int i = 0; i < 10; i++) {
		a += 0.1;		
		vec2 point = vec2 (a * cos (time * b), a * sin (time * b));
		blobValue += Blob (fragment, point, a * 0.5);
		b += 0.5;
	}
	
	blobValue = smoothstep (0.0, 1.0, blobValue * 3.0);	
	gl_FragColor = vec4 (blobValue * 0.2, blobValue * 0.4, blobValue, 1.0);
}