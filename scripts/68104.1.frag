// N290920N turn around
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define PI 3.141592653
#define TWO_PI 2.0*PI
#define t time*0.3
#define MAX 100.
void main( void ) {
	// vec2 uv = surfacePosition;
	vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 4.0;
	uv *= 24.6;
	vec2 z = uv;
	float e = 0.0;
	for (float i=0.0;i<=MAX;i+=1.0) {
		z = vec2(z.x * z.x - z.y * z.y, 1.0 * z.x * z.y) - uv; // z*cos(t)+uv*sin(t);		
		e += 0.0001/abs(sin(t+z.y) * sin(z.x));
		e -=cos(4.0*i/10.0);
	}
	gl_FragColor = vec4(vec3(e), 1.0);	
}
