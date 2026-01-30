// N290920N Waterfal
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
#define MAX 30.
void main( void ) {
	// vec2 uv = surfacePosition;
	vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 4.0;
	uv *= 2.0;
	
	float e = 0.0;
	for (float i=1.0;i<32.0;i++) {
		e += 0.005/abs(uv.y + atan(time + i*uv.x));
	}
	
	gl_FragColor = vec4(vec3(e), 1.0);	
}