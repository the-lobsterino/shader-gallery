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
	float g = 0.;
	float h = 0.;
	for(int i = 0; i < 16; i++)
	{
		x = abs(fract(x-.5)-.5)*4.;  
		f += x * a;
		g += x*x * a;
		h += x*float(i*i) * a;
		a *= -mouse.x;
	}

	float y = gl_FragCoord.y/resolution.y;

	f = float(f > sin(y*y*y) * 2.);
	g = float(g > sin(y*y*y) * 2.);
	h = float(h > sin(y*y*y) * 2.);
	
	gl_FragColor = vec4(f, g, h, 1.0);
}//sphinx