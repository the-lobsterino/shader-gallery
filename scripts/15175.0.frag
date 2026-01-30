#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = 3.1415;

float r = 1.0;
float g = 1.0;
float b = 1.0;

float r2 = 1.0;
float g2 = 1.0;
float b2 = 1.0;

float ti = time*3.0;
 
void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy )*2.0-vec2(1.0,1.0);
	vec2 m = (p);
	vec2 n = (sin(p*8.0));
	//n.x = abs(n.x);
	//n.y = abs(n.y);
	
	
	r2 = n.y;
	g2 = n.x;
	b2 = r2+g2;
	
	r = sin(b2*pi*8.+ti);
	g = sin(b2*pi*8.-ti);
	b = 1.0; //sin(b2*pi*8.-ti);
	
	r = r * n.y;
	g = g * (n.x);
	
	
	
	gl_FragColor = vec4(r,g,b,1.0);
}
