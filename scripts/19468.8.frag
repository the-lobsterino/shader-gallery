#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define LOOPS 5

float steps(float val, float vsteps) {
	//return val;
	return floor(val*vsteps)/vsteps;
}

float stepsloop(float val, float vsteps) {
	float ret = 0.0;
	for (int i=0; i<LOOPS; i++) {
		ret += steps(val, pow(vsteps,float(i))) / float(LOOPS);
	}
	return ret;
}
void main( void ) {

	vec2 p = surfacePosition;
	float base = 2.0+sin(sin(time)*2.0*(p.x+p.y));
	vec3 color = vec3(0);
	color += vec3(stepsloop(length(p),base),stepsloop(length(p),base*2.0),stepsloop(length(p),base*4.0));
	color += vec3(steps((p.x),base),steps((p.y),base),steps(abs(p.x+p.y),base));
	color += vec3(steps((p.x),base*2.0),steps((p.y),base*2.0),steps(abs(p.x+p.y),base*2.0));
	gl_FragColor = vec4( 1.0-color, 1.0 );

}