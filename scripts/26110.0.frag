#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

float s(float x, float b) {
	return sin(x * 4. * PI * b) / b;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float x = position.x;

	float p = 0.;
	float p1 = 0.;
	for (float i = 1.; i < 16.; i += 1.) {
		p  += s(x + 0.1 * time*i, pow(2., i));
		p1 *= s(x + 0.0 * time*i, pow(2., i));
	}
	
	p  =  1.0 * p;
	p1 =  0.8 * p;
	
	float color =  0.01 / abs(p - position.y);
	      color += 0.2/ abs(p1 - position.y);
	
	

	gl_FragColor = vec4( vec3(p1*time/10., p*time/20., sin(time/50.))*color, 1.0 );// Ok !

}