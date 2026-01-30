#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = (gl_FragCoord.xy / resolution - .5) * vec2(15., 20.);
	
	float row = floor(pos.y);
	
	float xshift =  (sin(time+row*.15) + sin(time*2.5 + row*.25));
	
	float angle = xshift + acos(pos.x) / 3.14159 * 9.0;

	if (fract(pos.y) < .13 || fract(angle) < 0.0) {
		gl_FragColor = vec4(0);
		return;
	}

	float color = sin(floor(angle));
	
	
	

	gl_FragColor = vec4(cos(color),cos(color+2.),cos(color+10.),1.)*.5+.5;

}