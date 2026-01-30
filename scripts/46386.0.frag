#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// 線の太さ
#define LINE_SIZE 0.02

void main( void ) {

        vec2 uv = ( gl_FragCoord.xy / resolution.x );        
        uv -= vec2(0.5, 0.5 * resolution.y / resolution.x);
        
        uv *= 10.0;;
        
        
        float d = length(uv) - time;
        
        d = fract(d);
        
        float w = step(d, LINE_SIZE) * 0.45;        

        gl_FragColor = vec4(w);
}