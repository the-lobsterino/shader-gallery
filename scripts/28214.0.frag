// Fractals: MRS
// by Nikos Papadopoulos, 4rknova / 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
//
// Adapted from https://www.shadertoy.com/view/4lSSRy by J.

// best on 1 resolution

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

    vec2 uv = (gl_FragCoord.xy / resolution.xy)-0.5;
    float t = time*.01, k = cos(t), l = sin(t);        
    
    	float s = .3;
    	//s = mouse.x;
	s += sin(fract(time));
    	for(int i=0; i<96; ++i) {
	        uv  = abs(uv) - s;    // Mirror
	        uv *= mat2(k,-l,l,k); // Rotate
	        s  *= .95156;         // Scale
    	}
	float r = cos(6.28318*(1200.*length(uv)));
	float g = cos(3.28318*(1200.*length(uv)));
	float b = cos(1.888*(2300.*length(uv)));
	gl_FragColor = vec4(vec3(r, g, b),1);
}