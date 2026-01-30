#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{

	
	float x = gl_FragCoord.x/resolution.x;
	float a = 1.;
	float f = 0.;
	for(int i = 0; i < 12; i++)
	{
		x = abs(fract(x-.5)-.5)*4.;  
		f += x * a;
		a *= -mouse.x;
	}

	float y = gl_FragCoord.y/resolution.y;

	f = float(f > y * 2.);
	
	gl_FragColor = vec4(f);
}//sphinx