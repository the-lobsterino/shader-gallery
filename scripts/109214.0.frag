#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

#define PI 3.14159265358979
#define N 5
void main( void ) {
	float size = 33.15;
	float dist = 0.1;
	float ang = 1.0;
	vec2 pos = vec2(0.0,0.0);
	vec3 color = vec3(0.1);;
	
	for(int i=0; i<N; i++){
		float r = 0.25;
		ang += PI / (float(N)*0.25)+(time/50.0);
		pos = vec2(cos(ang),sin(ang))*r*sin(time+ang/.6);
		dist += size / distance(pos,surfacePosition);
		vec3 c = vec3(0.153, 0.05, 0.1);
		color = c.yzx*dist;  
	}
	gl_FragColor = vec4(color, 1.0);
}