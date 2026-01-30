// can't stop the :^)
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TIME time*4.*PI
//#define TIME 0.

#define NOSE_X (p.x-0.05)

uniform float time;
varying vec2 surfacePosition;
uniform vec2 resolution;

uniform sampler2D backbuffer;

vec2 rotate( vec2 v, float t ) {
	return vec2( v.x*cos(t) - v.y*sin(t), v.y*cos(t) + v.x*sin(t));
}

void main( void ) {
	vec2 p = surfacePosition;
	p = rotate(p, TIME);
	
	float len = length(p);
	float angle = atan(p.x, -p.y);
	
	float smile = step(0.4, len) * step(len, 0.45) * step(abs(angle), PI*0.5);
	float eye1 = step(length(p - vec2(0.175, 0.3)), 0.075);
	float eye2 = step(length(p - vec2(-0.175, 0.3)), 0.075);
	
	float shear1 = NOSE_X/3. + (p.y+0.4);
	float shear1Final = step(0.5, shear1) * step(shear1, 0.55);
	float shear2 = NOSE_X/3. - (p.y-0.5);
	float shear2Final = step(0.5, shear2) * step(shear2, 0.55);

	
	float nose = shear1Final * shear2Final;
	nose += (shear1Final + shear2Final) * step(0.0, NOSE_X) * step(NOSE_X, 0.225);
	
	float road = step(surfacePosition.y, -0.45) * step(sin((TIME + surfacePosition.x*2.*PI)*2.), 0.);
	
	gl_FragColor = vec4(1.) * (smile + eye1 + eye2 + nose + road);

}