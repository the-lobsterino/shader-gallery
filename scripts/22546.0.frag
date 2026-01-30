#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define PI 3.14159265358979
#define N 4
void main( void ) {
	float size = 0.1;
	float dist = 0.0;
	float ang = 0.0;
	vec2 pos = vec2(0.0,0.0);
	vec3 color = vec3(0.0);;
	
	for(int j=0;j<2;j++){		
		for(int i=0; i<N; i++){
			float r = 0.4;
			pos = vec2(sin(ang+2.*float(i)*PI / (float(N)))*r,cos(ang+2.*float(i)*PI / (float(N)))*r);
			dist += size / distance(pos,vec2(surfacePosition.x,surfacePosition.y));
			vec3 c = vec3(0.1,0.2,0.3);
			color = c*dist;
		}
	}
	gl_FragColor = vec4(color, 1.0);
}