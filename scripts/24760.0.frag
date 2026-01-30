#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

#define PI 3.14159265358979
#define N 200
void main( void ) {
	
	float size = 0.1;
	float dist = 0.300;
	float ang = 0.0;
	vec2 pos = vec2(0.0);
	vec3 color = vec3(0.30, 0.2, 0.0);;
		
	for(int i=0; i<N; i++){
		float r = 0.429;
		ang += PI / (float(N)*0.001)+(time/900.0);
		pos = vec2(cos(ang),sin(ang))*r*cos(time+ang/.99);
		dist += size / distance(pos,surfacePosition);
		vec3 c = vec3(0.002, 0.001, 0.002);
		color = c*dist;  
	}
	gl_FragColor = vec4(color, 1.0);
}