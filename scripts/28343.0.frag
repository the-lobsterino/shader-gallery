// Fractals: MRS
// by Nikos Papadopoulos, 4rknova / 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
//
// Adapted from https://www.shadertoy.com/view/4lSSRy by J.

// best on 1 resolution


//the universe is a dance of relationships
//you are a dance the universe is having to experience itself
//it is but one mind experiencing itself in infinite ways, one infinite fractal holographic consciousness
//mmmm yeaaa baby get with it ur infinite

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hueToRGB(float hue) {
	    return clamp( 
	        abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 
	        0.0, 1.0);
	}


void main( void ) {

    vec2 uv = (gl_FragCoord.xy / resolution.xy)-0.5;
    float t = time*.01;
    float k = cos(t);
    float l = sin(t);        

    float s = .99;
	
    s = fract(t+length(uv));
    //s = cos(cos(fract(time*length(uv))));
	
    for(int i=0; i<96; ++i) {
        uv  = abs(uv) - s;    // Mirror
        uv *= mat2(k,-l,l,k); // Rotate
        s  *= .95156;         // Scale
    }
    
    float x = cos(6.28318*((1200.*mouse.x)*length(uv)));
    gl_FragColor = vec4(hueToRGB(x+t),1);
	
    
    //gl_FragColor = vec4(fract, 0.0, 0.0, 1.0);
}