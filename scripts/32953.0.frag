// Fractals: MRS
// by Nikos Papadopoulos, 4rknova / 2015
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
//
// Adapted from https://www.shadertoy.com/view/4lSSRy by J.

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

    vec2 uv = .275 * gl_FragCoord.xy / resolution.y;
    float t = time*.03, k = cos(-t), l = sin(-t);        
    
    float s = .2;
    for(int i=0; i<16; ++i) {
        uv  = abs(-uv)- s+0.07*sin(time*0.03);    // Mirror
        uv *= mat2(k,-l,l,k); // Rotate
        s  *= .8;         // Scale
    }
    
    float x = .5 + .5*sin(6.28318*(length(uv*100.0+s)));
    gl_FragColor = vec4(1.0,x,0.,1);
}