// Fractals: MRS
// by Nikos Papadopoulos, 4rknova / 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
//
// Adapted from https://www.shadertoy.com/view/4lSSRy by J.

// best on 1 resolution

//colors modified by Alexander Unverzagt 2023

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 polar(float theta, float phi) { //not really polar, but otherwise we get boring colors near the poles
   return vec3(cos(phi)+sin(theta), sin(phi)*cos(theta), sin(phi)*sin(theta));
}

void main( void ) {

    vec2 uv = (gl_FragCoord.xy / resolution.xy)-0.5;
    vec2 uv2 = uv;
	
    float t = time*.01, k = cos(t), l = sin(t);        
    
    float s = .3;
    s = mouse.x;
    for(int i=0; i<96; ++i) {
        uv  = abs(uv) - s;    // Mirror
        uv *= mat2(k,-l,l,k); // Rotate
        s  *= .95156;         // Scale
    }
    
    float t2 = time*.007, k2 = cos(t2), l2 = sin(t2);  
    float s2 = mouse.y;
    for(int i=0; i<93; ++i) {
        uv2  = abs(uv2) - s2;    // Mirror
        uv2 *= mat2(l2,-k2,k2,l2); // Rotate
        s2  *= .9536;         // Scale
    }
    
    float x = (6.28318*(42.*length(uv)+k));
    float y = (6.28318*(69.*length(uv2)) + t);
    gl_FragColor = vec4(polar(x,y),1);
}