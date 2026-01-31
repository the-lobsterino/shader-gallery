#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const int GRID_SIZE_PX = 10;

void main( void ) {
	
    
    	vec2 px = gl_FragCoord.xy * resolution.xy;
    	vec2 modulo_vec = (px - vec2(GRID_SIZE_PX) * floor(px / vec2(GRID_SIZE_PX))) / resolution.xy;
   
    	// Output to screen
    	gl_FragColor = vec4(px, 1.0, 1.0);
}