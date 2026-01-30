#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// Space Gif by Martijn Steinrucken aka BigWings - 2019
// Email:countfrolic@gmail.com Twitter:@The_ArtOfCode
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Original idea from:
// https://boingboing.net/2018/12/20/bend-your-spacetime-continuum.html
//
// To see how this was done, check out this tutorial:
// https://youtu.be/cQXAbndD5CQ
//

void main( void ) {


    vec2 uv = surfacePosition;//(gl_FragCoord.xy-resolution.xy*.5)/resolution.y;
	vec3 m =vec3(.5,1,0);
    uv *= mat2(.707, -.707, .707, .707);
    
	uv *= 5.;
    
    vec2 gv = fract(uv)-.5; 
	vec2 id = floor(uv);
    
	//vec3 m = vec3(.5,1,0);
    float t;
    for(float y=-1.; y<=1.; y++) {
    	for(float x=-1.; x<=1.; x++) {
            vec2 offs = vec2(x, y);
            
            t = -time+length(id-offs)*.2;
            float r = mix(.4, 1.5, sin(t)*.5+.5);
    		float c = smoothstep(r, r*.9, length(gv+offs));
    		m.zyx = m.yxz*(1.-c) + c*(-m.xzy);
        }
    }
uv *= 5.;
    
     gv = fract(uv)-.5; 
	 id = floor(uv);
    
	//vec3 m = vec3(.5,1,0);
    // t;
    for(float y=-1.; y<=1.; y++) {
    	for(float x=-1.; x<=1.; x++) {
            vec2 offs = vec2(x, y);
            
            t = -time+length(id-offs)*.2;
            float r = mix(.4, 1.5, sin(t)*.5+.5);
    		float c = smoothstep(r, r*.95, length(gv+offs));
    		m.zyx = m.yxz*(1.-c) + c*(1.-m.xzy);
        }
    }
    gl_FragColor = vec4(m,1);
}



