#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// thanks: https://wgld.org/d/glsl/

// Author: https://twitter.com/c0de4
// Ameba~~


float random (in vec2 st) { 
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))
		 * 43758.5453123);
}

// The MIT License
// Copyright © 2013 Inigo Quilez
float n( in vec2 p )
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
	float t = time;
	
	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);
	p.x=dot(p,p*2.0);
	vec2 q = vec2(n(p));
	#define d p = vec2( n(vec2(p.x+cos(n(p+t)), p.y+sin(n(p+t)))) );
	#define d2 p = abs(p+q/p-q) / dot(p, p)-n(q+t);
	d;
	d2;
	
	
	float c1 = float(pow(p-q, q/p));
	
	float c = length(c1);

	gl_FragColor = vec4( vec3( c*.2+cos(t)*.1, c*.7+cos(t*1.1)*.1, c*.5+sin(t*.9)*.1 ), 1.0 );

}