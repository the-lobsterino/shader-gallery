// F--up by Mr. VB

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define PI 3.14159265358979
#define N 20
void main( void ) {
	float size = 0.2;
	float dist = 0.0;
	float ang = 0.0;
	vec2 pos = vec2(0.0,0.0);
	vec3 color = vec3(0.1);;
	
	for(int i=0; i<N; i++){
		float r = 0.4;
		ang += PI / (float(N)*0.5);
		pos = vec2(cos(ang),sin(ang))*r*cos(0.5*time*ang/.5);
		dist += size / distance(pos,surfacePosition);
		vec3 c = vec3(0.04);
		color += 0.05*c*sin(10.0*dist/sin(gl_FragCoord.x))*100.0;
	}
	gl_FragColor = vec4(color, 1.0);
}