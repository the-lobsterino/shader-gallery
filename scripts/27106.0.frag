#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

float s(float x, float b) {
	return sin(x * 2. * PI * b) / b;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 x = position;

	float t = mod(time, PI/1.0);
	float p = 0.;
	float p1 = 0.;
	for (float i = 1.; i < 32.; i += 1.) {
		p  += s(x.x + 0.1 * 1.0*i, pow(2.0, i));
		p1 *= s(x.x + 10.2 * 2.0*i, pow(2., i));
	}
	
	p  =  0.20 * p * cos(t*10.0);
	p1 =  1.16 * p * sin(t);
	
	float color =  0.01 * cos(t*30.0) / abs(p*2.0 - position.y);
	      color += 0.02 * sin(t*40.0)  / abs(p1*2.0 - position.y);
	
	

	gl_FragColor = vec4( vec3(p1*time/10., p*time/50., sin(time/50.))*color, 1.0 );// Ok !

}