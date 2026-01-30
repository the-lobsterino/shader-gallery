#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// thanks: https://wgld.org/d/glsl/

// Author: https://twitter.com/c0de4
// Ａurora


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
	//p *= 2.;
	#define m2 p *= mat2(n(p+t*.01), sin(t*t*.0001-t), -n(p-t-t*.01), cos(-t*.01));
	m2;
	
	vec2 q = vec2(p.x-n(p.xx+t)-t, p.yy*.5*n(vec2(sin(n(p.yy+t)))) );
	#define m1 q = vec2(q.y-n(p.y/q.xx/t*t*.01)/t+.25, q.y+n(p-q.yy+t*t*.001)-.5);
	#define m p = vec2(1.+p.xx+n(p-q+t-cos(t*t*.0001)));
	
	m;
	m1;
	
	float c = length(q)/length(mod(mix(p, q, cos(t)), 4.+cos(t)-n(p-q/t)));

	gl_FragColor = vec4( vec3( c*.2+cos(t)*.1, c*.7+cos(t*1.1)*.1, c*.5+sin(t*.9)*.1 ), 1.0 );

}