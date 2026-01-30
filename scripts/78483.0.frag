#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	if(abs(position.y * 2.0 - 1.0 - sin(position.x * 10.0)) < 0.005)
		gl_FragColor = vec4(1,0,0,1);
	else
		gl_FragColor = vec4(0,0,0,1);
	//gl_FragColor = vec4(position.x, position.y, 0.0, 1.0);

}