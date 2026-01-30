#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float color = 1.0;
	if(mod(mouse.x, 2.0) != 0.0 && mod(mouse.y,2.0) != 0.0)
	{
		color = 0.0;	
	}
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}