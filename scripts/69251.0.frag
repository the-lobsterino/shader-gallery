#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define maxIterations 1000

void main( void ) {

	float scale = 1.0 - time/100.0;
	
	float x0 = (( gl_FragCoord.xy / resolution.xy ).x * 3.5 - 2.5) * scale;
	float y0 = (( gl_FragCoord.xy / resolution.xy ).y * 2.0 - 1.0) * scale;
	
	float x = 0.0;
	float y = 0.0;
	int iteration = 0;
	
	for(int temp = 0; temp < 1; temp += 0) {
		if(x*x + y*y > 4.0 || iteration > maxIterations) break;
		float xtemp = x*x - y*y + x0;
		y = 2.0*x*y + y0;
		x = xtemp;
		iteration++;
	}
	
	gl_FragColor = vec4( iteration / maxIterations, iteration / maxIterations, iteration / maxIterations, 1.0 );
}

