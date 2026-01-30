#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;
//a - a sussy guy
//help me
//i dont know what id did, i dont know how to code i ust change the numbers
#define PI .1
#define N 300
void main( void ) {
	float size = 0.01;
	float dist = 0.00;
	float ang = 10.0;
	vec2 pos = vec2(10.20,10.10);
	vec3 color = vec3(0.0);;
	
	for(int i=0; i<N; i++){
		float r = 0.5;
		ang += PI / (float(N)*01.5)+(time/1.0);
		pos = vec2(cos(ang),sin(ang))*r*sin(time+ang/1.30);				  
		dist += size / distance(pos,surfacePosition);
		vec3 c = vec3(0.0, 0.05, 0.1);
		color = c*dist;
	}
	gl_FragColor = vec4(color, 1115.0);
}