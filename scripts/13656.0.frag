// linear gradient shader with flexible stops by @void256
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

const int stopCount = 3;
vec4 stopC[stopCount];
float stopD[stopCount];

vec2 a = vec2(   0.0, 0.0);
vec2 b = vec2( 500.0, 500.0);

void main(void) {
	stopD[0] = 0.0;
	stopC[0] = vec4(1.0, 0.0, 0.0, 1.0);

	stopD[1] = 0.5;
	stopC[1] = vec4(1.0, 1.0, 0.0, 1.0);

	stopD[2] = 1.0;
	stopC[2] = vec4(0.0, 0.0, 1.0, 1.0);

	vec2 dir = normalize(b - a);
	float d = dot(dir, gl_FragCoord.xy - a) / length(b - a);

	vec4 c = stopC[0];
	if (d > stopD[stopCount-1]) {
		c = stopC[stopCount-1];
	}

	for (int i=0; i<stopCount-1; i++) {
		if (d > stopD[i] && d <= stopD[i+1]) {
			float inStopD = (d - stopD[i]) / (stopD[i+1] - stopD[i]);
			c = mix(stopC[i], stopC[i+1], inStopD);
		}
	}
	gl_FragColor = c;
}