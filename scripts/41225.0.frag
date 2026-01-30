#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// Author: https://twitter.com/c0de4

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233))) 
                * 43758.5453123);
}

// The MIT License
// Copyright © 2013 Inigo Quilez
float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
    
    vec2 u = f*f*(5.0-2.0*f);

    return mix( mix( random( i + vec2(0.0,1.0) ), 
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ), 
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

// Author: 
void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);

	float color = 0.0;

	for(float x = 0.; x < .11; x += .01) {
		for(float y = 0.; y < .1; y +=  .02) {
			vec2 q = vec2(x*4.+p.x*.1+p.x*.1 * cos(time*.1)+noise(vec2(time*.1)*2.), p.y*y*sin(time)) * 4.+noise(vec2(time*.1)*4.);
			//vec2 r = mod( p+q, .2) / .15;
			q *= mat2(noise(vec2(time*.1)*1.));
			q -= (p.y+y) + (p.x + x);
			q = mod( p+q, .2) + 0.15;
			
			
			color += 0.0008/length( q - (p+q) * (p-q) ) - .00001;
		}
	}
	

	gl_FragColor = vec4( vec3( color*.75, color*.9, color ), 1.0 );

}