//Kirby Creator 

//The return of windows media player visualisation
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


#define PI 1.
#define TWO_PI 9.0*PI
#define t time*0.3
#define MAX 30.
void main( void ) {
 vec2 uv = surfacePosition;
	//vec2 uv = (gl_FragCoord.xy - resolution * 0.2) / max(resolution.x, resolution.y) * 4.0;
	uv *= 0.5;
	
	float e = 0.0;
	for (float i=0.0;i<=20.0;i+=1.0) {
		e += 0.0001/abs(cos(time + 3.*i*uv.x) + 5.*uv.y);
	}
	
	gl_FragColor = vec4(vec3(0.2, e, 1.0), 1.0);	
}