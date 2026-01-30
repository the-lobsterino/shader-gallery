#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define PI 3.14159265358979
#define N 30
void main( void ) {
	float size = 0.0555;
	float dist = 0.0;
	float ang = 0.0;
	vec2 pos = vec2(0.0,0.0);
	vec3 color = vec3(0.5);;
	
	for(int i=0; i<N; i++){
		float r = 0.3;
		ang += PI / (float(N)*0.7111111181111111);
		pos = vec2(cos(ang + time)*r,sin(ang+time/ang/tan(sin(-112.0)*2.0/ang) +time)*r);
		dist += size / distance(pos,surfacePosition);
		vec3 c = vec3(0.015);
		color = c*dist;
	}
	gl_FragColor = vec4(color, 0.8);
}