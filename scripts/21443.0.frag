#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

#define SPEEDX -50.
#define SPEEDY 30.

#define COLOR_W vec4(1.0,1.0,1.0,1.0)
#define COLOR_B vec4(0.0,0.4,0.4,1.0)

#define SIZEX 50
#define SIZEY 50

void main( void ) {
	vec4 color;
	
	int x = int(gl_FragCoord.x + time * SPEEDX) / SIZEX;
	int y = int(gl_FragCoord.y + time * SPEEDY) / SIZEY;
	
	float sum = float(x+y);
	
	if (mod(sum, 2.) == 0.)
		color = COLOR_W;
	else
		color = COLOR_B;
	
	gl_FragColor = color;
}