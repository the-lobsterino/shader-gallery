#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{

	if(gl_FragCoord.x >= 100.0+mouse.x*200. && gl_FragCoord.x <= 200.0+mouse.x*200. && gl_FragCoord.y >= 100.0+mouse.y*100. && gl_FragCoord.y <= 200.0+mouse.y*100.)
	{	
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
	else
	{
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
}
