#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

float hf( float h )
{
	// Uncommening the following fixes the shader for an unknown reason.
	// return h;
	return clamp((abs(fract(h) * 6. -3.) -2.), 0.0, 1.);
}

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	vec3 color1 = vec3(hf(p.y+time/4.), hf((p.y+.33)+time/4.), hf((p.y+.66)+time/4.));
	

	// Divide screen into 3 horizontal stripes.
	// Commenting out either if (#27 or #28) fixes the shader for an unknown reason.
	vec3 color = color1;
	 
	
	// It should be either color1, color2 or color3, but it's
	// black on Alex for an unknown reason.
	gl_FragColor = vec4(color, 1.0);
}