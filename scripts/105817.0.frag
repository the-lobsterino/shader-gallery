#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// Tutorial here: 
//
// * https://www.youtube.com/watch?v=-z8zLVFCJv4
//
// * https://iquilezles.org/live/index.htm

// Converted to work on this site by @chaosrayne86 on Steam


void main()
{
	vec2 q = 0.6 * (2.0*gl_FragCoord.xy-resolution.xy)/min(resolution.y,resolution.x);

    float a = atan( q.x, q.y );
    float r = length( q );
    float s = 0.50001 + 0.5*sin( 3.0*a + time );
    float g = sin( 1.57+3.0*a+time );
    float d = 0.15 + 0.3*sqrt(s) + 0.15*g*g;
    float h = clamp( r/d, 0.0, 1.0 );
    float f = 1.0-smoothstep( 0.95, 1.0, h );
    
    h *= 1.0-0.5*(1.0-h)*smoothstep( 0.95+0.05*h, 1.0, sin(3.0*a+time) );
	
	vec3 bcol = vec3(0.9+0.1*q.y, 1.0, 0.9-0.1*q.y);
	bcol *= 1.0 - 0.5*r;
    vec3 col = mix( bcol, 1.2*vec3(0.65*h, 0.25+0.5*h, 0.0), f );

    gl_FragColor = vec4( col, 1.0 );
}