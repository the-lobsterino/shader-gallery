#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;

vec3 getColor(float phase);

#define stripes 17.
#define k 9.

float PI = 4.*atan(1.);

void main(void) {
	vec3 c = getColor(time*0.1*PI);
	gl_FragColor = vec4(c, 1.2);

}

vec3 getColor(float phase) {
	vec2 p = surfacePosition;
	float theta = atan(p.y, p.x);
	float r = log(dot(p, p));
	float c = 0.;
	float tt;
	for (float t=0.; t<k; t++) {
		float tt = t * PI;
		c += cos((theta*cos(tt) - r*sin(tt*tt)) * stripes + phase*tt);
	}
	c = (c+k) / (k*2.);
	c = smoothstep(0.48, 0.52, c);
	if (c > 0.5) {
		return vec3(c);
	} else {
		return texture2D(backbuffer, gl_FragCoord.xy/resolution).rgb;
	}
}