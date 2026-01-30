#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
varying vec2 surfacePosition;

#define PI 3.14159265358979
#define N 50

void main( void ) {
	surfacePosition.x=256;
	
	float size = sin(time)*.02+0.022;
	float dist = 0.1;
	float ang = time;
	vec2 pos = vec2(0.0,0.0);
	vec3 color = vec3(0.0);
	float r = cos(time)*0.2+.2;
	for(int i=0; i<N; i++){
		ang += PI / (float(N) * cos(time));
		pos = vec2(cos(ang)*r,mouse.y / 4.0+0.);
		dist += size / distance(pos,vec2(surfacePosition.x +0.,surfacePosition.y+0.));
		vec3 c = vec3(0.1,0.2,0.3);
		color = c*dist;
	}
	gl_FragColor = vec4(color * 0.1, 1.0);
}