//co3moz
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define drawFunctionRGB(function, r, g, b) if(distance(position.y, (1. + function(position.x*10.))/2.) < 0.01) color = vec3(r, g, b)
#define drawFunctionRGB_shifted(function, shift, r, g, b) if(distance(position.y, (1. + function(position.x*10. + shift))/2.) < 0.01) color = vec3(r, g, b)
#define difference 2.0943951023931954923084289221863

float myFunction(float x) {
	return sin(x) * cos(x*1.) * .5;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec3 color;

	for(float i = 0.0; i<20.0;i+= 1.) {
		drawFunctionRGB_shifted(myFunction, time + i, sin(time), sin(time + difference), sin(time + 2. * difference));
	}
	
	
	gl_FragColor = vec4( color, 1.0 );

}