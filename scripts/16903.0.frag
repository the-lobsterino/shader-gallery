#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 canvasPos = (surfacePosition / resolution.x) * 2000.0;
	canvasPos.x -= 0.5;
	
	// Starting position
	float x = 0.0;
	float y = 0.0;
	
	// Depending on your browser/pc you can change this value
	
	for(int i = 0; i < 100;i++){
		float xT =  x*x - y*y + canvasPos.x;
		y = 2.0*x*y + canvasPos.y;
    		x = xT;
	}
	
	float dst = (x*x + y*y);
	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	
	int coloring_mode = 3;
	
	if (coloring_mode == 1)
	{
		r = sin(dst + 2.0943951);
		g = sin(dst + 4.1887902);
		b = sin(dst);
	}
	else if (coloring_mode == 2)
	{
		r = 1.0-(x*x + y*y);
		g = 1.0-(x*x);
		b = 1.0-(y*y);
	}
	else if (coloring_mode == 3)
	{
		r = 0.5-(x*x + y*y);
		g = 1.0-(x*x*20.0);
		b = 0.2-(2.0*x*y);
	}
	
	// some coloring
	gl_FragColor = vec4(r,g,b,1.0);
}