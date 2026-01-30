#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main( void ) 
{
	float x			= (32.*32.) / length(gl_FragCoord.xy - resolution.xy * .5);
	float y			= (atan(gl_FragCoord.x-resolution.x * .5, gl_FragCoord.y-resolution.y * .5) + (4.*atan(1.)))/(8.*atan(1.));
	
	x 			*= 256.;
	y			*= 256.;
	
	float t			= mod(y * 32. + time * 32. + x, 32.);
	float sequence 		= mod(y * 25., 39.);
	bool plot		= sequence + t < x / 256.;
	

	gl_FragColor		= vec4(plot) + vec4(0., 0., 0., 1.);;
}