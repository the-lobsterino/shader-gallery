#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float speed;

void main( void ) {

	//set speed to whatever you want make sure that it is a decimal number or else it wont complile.
	speed = 100.;
	
	if(speed > 500.)
	{
		speed = 500.;
	}
	
	gl_FragColor = vec4( vec3((sin(time*speed)), cos(time*speed), sin(time*speed)+2.), 1.0 );

}