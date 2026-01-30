#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float r = 0., power = .05, speed = .2;
	
	vec2 targets[4];
	targets[0] = vec2((sin(time / speed) + 1.) * .5, .5);
	targets[1] = vec2((cos(time / speed) + 1.) * .5, .5);
	targets[2] = vec2(.5, (sin(time / speed) + 1.) * .5);
	targets[3] = vec2(.5, (cos(time / speed) + 1.) * .5);
	
	for(int i = 0; i < 4; i++)
		r += power / (distance(position, targets[i]));
	
	vec4 color = vec4(r / 9., r / 4., r / 2., 1.);
	
	gl_FragColor = color;

}