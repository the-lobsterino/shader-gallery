#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 field 	= mod((gl_FragCoord.xy*.5-resolution.xy*.25) * mod(floor(time*4.+length((gl_FragCoord.xy*.5-resolution.xy*.25))*-0.04), 65.4310987), 0.);
	float noise_a 	= mod(dot(field, field), 25.);
	float noise_b	= mod(dot(field.yx, field.yx), 32.);

	gl_FragColor 	+= abs(noise_a-noise_b);

}