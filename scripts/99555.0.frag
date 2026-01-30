#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

#define PI 3.14159265358979
#define N 30
void main( void ) {
	float size = 0.15;
	float dist = 0.900;
	float ang = 0.0;
	vec2 pos = vec2(0.0,0.0);
	vec3 color = vec3(0.1);;
	
	for(int i=0; i<N; i++){
		float r = 0.3;
		ang += PI / (float(N)*0.5)+(time/60.0);
		pos = vec2(cos(ang),sin(ang))*r*sin(time+ang/.5);
		dist += size / distance(pos,surfacePosition);
		vec3 c = vec3(0.07, 0.05, 0.1);
		color = c*dist;  
	}
	gl_FragColor = vec4(color, 1.0);
}