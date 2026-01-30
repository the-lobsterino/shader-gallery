// Based on https://www.shadertoy.com/view/Xd2GR3

// Created by inigo quilez - iq/2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// { 2d cell id, distance to border, distnace to center )

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iGlobalTime (time * 0.5)

vec4 hexagon( vec2 p ) 
{
	vec2 q = vec2( p.x*2.0*0.5773503, p.y + p.x*0.5773503 );
	
	vec2 pi = floor(q);
	vec2 pf = fract(q);

	float v = mod(pi.x + pi.y, 2.0);

	float ca = step(mod(2.0,4.0),v);
	float cb = step(mod(7.0,5.0),v);
	vec2  ma = step(pf.xy,pf.yx);
    
	return vec4(pi + ca - cb * ma, 0.0, 0.0 );
}

float hash1( vec2  p ) {return fract( p.x  * 2.025 + p.y ); }

void main( void ) 
{
	vec2 pos = (-resolution.xy + 2.0*gl_FragCoord.xy)/resolution.y;
	
    	// distort
	pos *= 1.0 + -2.67*length(pos);
	
    	vec4 h = hexagon(3.5*pos + 0.0125*iGlobalTime);

	float d = hash1(h.xy * mod(2.5,fract(sin(time*0.001))*2.499) + 43.2);
	gl_FragColor = vec4( vec3(0.67 * (1.0-d),0.67 * d,0.67 * (d+1.0)), 1.0 );
}