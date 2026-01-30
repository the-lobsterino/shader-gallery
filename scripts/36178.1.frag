#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 uv 	= gl_FragCoord.xy / resolution.xy;
	
	vec2 field	= gl_FragCoord.xy * 7./32.;
	field		= fract(field) 	* 1./8.;
	
	float angle	= fract(field.y + mouse.y);
	angle		= float(floor(angle * 8.) == floor(uv.x * 8.));
	
	gl_FragColor 	= vec4(angle);

}