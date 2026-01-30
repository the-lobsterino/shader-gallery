#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float circ_condition = length(resolution/2.0-vec2((gl_FragCoord.x - sin(gl_FragCoord.x*(cos(time)/200.0)) * 100.0),(gl_FragCoord.y - cos(gl_FragCoord.y * (sin(time)/200.0)) * 100.0))) - 15.0;
	float circ_color_step = dot(gl_FragCoord.x/resolution[0], gl_FragCoord.y/resolution[1]);
	
	float red = circ_condition < abs(sin(time))*100.0 ? 1.0-circ_color_step : .0;
	float green = circ_condition < abs(sin(time))*130.0 ? abs(0.0-circ_color_step) : 0.0;
	float blue = circ_condition < abs(cos(time))*100.0 ? 1.0-circ_color_step : 0.0;
	gl_FragColor = vec4(red, green, blue, 1);

}