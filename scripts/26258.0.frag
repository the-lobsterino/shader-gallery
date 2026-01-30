#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
	float lineC = 8.0 + 0.8*resolution.y*sin(0.1*(time));
	float stripeWidth = resolution.y / (2.0*lineC);
	
	 if(mod(gl_FragCoord.y, 2.0*stripeWidth) > stripeWidth)
	{
		gl_FragColor = vec4(1.0, .0, 1.0,1.0);
	}
	else
	{
		gl_FragColor = vec4(0.0, 0.0, 0.0,1.0);
	}
}