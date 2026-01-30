#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D backbuffer;
#define PI 3.14159265358979
#define N 33
void main( void ) {
	float size = 0.0555;
	float dist = 0.0;
	float ang = 0.0;
	vec2 pos = vec2(0.0,0.0);
	vec3 color = vec3(0.5);;
	
	for(int i=0; i<N; i++){
		ang += 0.15*PI / (float(N)*1.8);
		float r = 0.42;
		pos = vec2(cos(ang + time*33.),sin(ang + time*33.))*r;
		dist += 0.4*pow(ang, 1.333)*size / distance(pos,surfacePosition);
		vec3 c = vec3(0.056,0.05,0.045);
		color = c*dist;
	}
	gl_FragColor = vec4(color, 1.0);
	
	// needs moar backbuffer
	gl_FragColor *= 0.1;
	gl_FragColor += (1.-length(pow(gl_FragColor, vec4(6.+4.*cos(time*0.2)))))*texture2D(backbuffer, gl_FragCoord.xy/resolution);
}