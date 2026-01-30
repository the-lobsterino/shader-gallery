#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Author: https://twitter.com/c0de4
// GUMI~

float random (in vec2 st) { 
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))
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

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 4. - resolution.xy * 4. ) / min(resolution.x, resolution.y);
	vec2 q = vec2(noise(vec2(p.x+cos(time*1.2)))*.5, noise(vec2(p.y+sin(time*1.1)))*.5);
	vec2 r = vec2(noise(vec2(q.x+cos(time*.8)))*.5, noise(vec2(q.y+sin(time*.9)))*.5);
	
	p = mod(p, 1.4) - .7;

	
	#define d1 p = vec2(dot(p-q-r, p-q-r))
	#define d2 q = vec2(dot(q-r-p, q-r-p))
	#define d3 r = vec2(dot(r-p-q, r-p-q))
	
	d3;d2;d1;d3;d2;d1;d1;

	gl_FragColor = vec4( vec3( p, p.x ), 1.);

}