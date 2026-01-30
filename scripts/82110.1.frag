#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
//a - a sussy guy
//help me
//i dont know what id did, i dont know how to code i ust change the numbers
#define PI 1.0/3.14192
#define N 128
void main( void ) {
	float size = 0.0125;
	float dist = 0.00;
	float ang = 10.0;
	vec2 pos = vec2(40.80,10.10);
	vec3 color = vec3(0.0);;
	float t = surfaceSize.x*surfaceSize.y;//fract(time*1e-3) * 2.0 - 1.0;
	
	for(int i=0; i<N; i++){
		float r = 0.5;
		ang += PI / (float(N-i)*05.5)+(t);//600.0);
		pos = vec2(cos(ang),sin(ang-t))*r*sin(t+ang/.30);				  
		dist += size / distance(pos,surfacePosition);
		vec3 c = vec3(dist);//0.0, 0.05, 0.1);
		color = fract(c*dist);
	}
	gl_FragColor = vec4(color, 5.0);
}