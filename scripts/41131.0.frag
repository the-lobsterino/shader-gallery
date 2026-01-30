#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

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
    
    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( random( i + vec2(0.0,0.0) ), 
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ), 
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}


// Author: https://twitter.com/c0de4
void main( void ) {

  vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / min(resolution.x, resolution.y);

	float color = 0.0;
	
	for(float i = 0.; i < 16.; i++) {
		float j = i + 1.;
		vec2 q = vec2(p.x*j*.03, p.y*j*.2);
		q *= mat2(cos(time*.4)*.01, sin(time*.3)*.1, -sin(time*.2)*.01, cos(time*.1)*.1);
		q = mod(q, .2) - .1;
		color += .0005 / length(p*q);
	}

  gl_FragColor = vec4( vec3( color ), 1.0 );

}

