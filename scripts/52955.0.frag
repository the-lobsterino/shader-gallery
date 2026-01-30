#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / 20.0);

	float color = 0.0;
	color += sin(time*5.0 - position.y);
	color *= sin(position.x + sin(position.y * 0.5) + cos(time) * 3.0);
	
	gl_FragColor = vec4(color, sin(color + 3.2), color, 0.5 );

}