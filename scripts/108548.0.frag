#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define l 1024

void main( void ) 
{
	// on Nvidia I see a non-black screen. On Intel its black.
	
	// Is this thread private memory leaking video memory (GL context robustness)?
	// Or is it register bit?
	// Assuming it's registers, how could there be 1024?

	float stuff[l];
	
	float v = 0.0;
	
	for (int i=0; i<l; i++)
	{
		v += abs(stuff[i]);
	}

	gl_FragColor = vec4( vec3( v/(1.0+v) ), 1.0 );
	

}