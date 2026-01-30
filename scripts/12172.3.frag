#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

const float ZOOM       = 1.0/1000.0;
const float TIME_FREQ  = 0.1250;
const float TIME_RANGE = 0.5;
const int FRACTAL_LOOP_COUNT = 20;

void main()
{
	vec2 sp = surfacePosition*1000.0;
	float t=time;
	float v=.001;
	vec3 p;
	
	p = vec3(sp,0)*(ZOOM+mouse.y-0.5);
	for (int i=0; i<FRACTAL_LOOP_COUNT; i++) {
		//p=abs(p)/dot(p,p) - (.5 + sin(t*TIME_FREQ)*TIME_RANGE);
		p=abs(p)/dot(p,p) - (.5 + mouse.x-0.5);
	}
	
	gl_FragColor.rgb=p;
}