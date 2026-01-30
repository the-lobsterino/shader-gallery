#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	vec2 point1 = vec2(0.6, 0.6);
	vec2 point2 = vec2((sin(time) + 1.0)*0.7, (cos(time)+1.0)*0.7);
	vec2 point3 = vec2(0.9, 0.6);
	
	float colour_r = (length(mouse-position)*length(point2-position)*length(point3-position)) * 2.0 + 0.1;
	float colour_g = (length(mouse-position)*length(point3-position)) * 2.1 + 0.1;
	float colour_b = (length(point2-position)*length(mouse-position)) * 3.0+ 0.1;

	gl_FragColor = vec4( colour_r, colour_g, colour_b, 1.0 );

}