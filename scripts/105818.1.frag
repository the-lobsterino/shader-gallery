#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Copyright Inigo Quilez, 2013 - https://iquilezles.org/
// I am the sole copyright owner of this Work.
// You cannot host, display, distribute or share this Work in any form,
// including physical and digital. You cannot use this Work in any
// commercial or non-commercial product, website or project. You cannot
// sell this Work and you cannot mint an NFTs of it.
// I share this Work for educational purposes, and you can link to it,
// through an URL, proper attribution and unmodified screenshot, as part
// of your educational material. If these conditions are too restrictive
// please contact me and we'll definitely work it out.

// Converted to work on this site by @chaosrayne86 on Steam

void main()
{
    vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/min(resolution.y,resolution.x);
    
    float a = atan(p.x,p.y);
    float r = length(p)*(0.8+0.2*sin(0.3*time));
    
    float w = cos(2.0*time-r*2.0);
    float h = 0.5+0.5*cos(12.0*a-w*7.0+r*8.0+ 0.7*time);
    float d = 0.25+0.75*pow(h,1.0*r)*(0.7+0.3*w);
    float f = sqrt(1.0-r/d)*r*2.5;
    f *= 1.25+0.25*cos((12.0*a-w*7.0+r*8.0)/2.0);
    f *= 1.0 - 0.35*(0.5+0.5*sin(r*30.0))*(0.5+0.5*cos(12.0*a-w*7.0+r*8.0));
    vec3 col = vec3( f,
                    f-h*0.5+r*.2 + 0.35*h*(1.0-r),
                    f-h*r + 0.1*h*(1.0-r) );
    col = clamp( col, 0.0, 1.0 );
    vec3 bcol = mix( 0.5*vec3(0.8,0.9,1.0), vec3(1.0), 0.5+0.5*p.y );
    col = mix( col, bcol, smoothstep(-0.3,0.6,r-d) );
    
	gl_FragColor = vec4( col, 1.0 );
}