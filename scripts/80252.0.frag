#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.00007,
                        // (3.0-sqrt(3.0))/6.0
                        1.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -1.577350269189626,
                        // -1.0 + 2.0 * C.x
                        1.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(permute( i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}

//Author: ipie
//Title: So this is what happens when I don't reuse old code (except the noise function I borrowed)

float boxnt(vec2 np, vec2 sl) {
	float tm = clamp(((sin(time+floor(sl.y))+1.)/2.)*1.1,0.0,1.0);
	float op = 1.;//+0.1*snoise(fract(gl_FragCoord.xy/2.)//+0.1*snoise(sl)
	op = step(0.1+0.005*snoise(sl*75.),np.x)-step(0.9+0.005*snoise(sl*75.),np.x);
	op *= 1.-(step(0.45+0.05*tm+0.005*snoise(sl*75.),np.x)-step(0.55-0.05*tm+0.005*snoise(sl*75.),np.x));
	//op *= (1.-step(0.9+(tm*0.1),np.x))+(step(0.1-(tm*0.1),np.x));
	op *= step(0.25+0.02*snoise(sl*100.),np.y)-step(0.75+0.02*snoise(sl*100.),np.y);
	return op;
}

void main( void ) {

	vec2 np = gl_FragCoord.xy/ resolution.xy;
	vec2 sl = vec2(np.x,np.y*5.);
	vec2 ps = fract(sl);//+0.1*snoise(fract(gl_FragCoord.xy/2.)));//This isn't what I meant to do but it sure does look cool
	
	
	vec3 colorBack = vec3(0.5,0.5,0.5);
	vec3 colorFore = vec3(1.,1.,1.);
	vec3 color = boxnt(ps, sl)*colorFore + (1.-boxnt(ps, sl))*colorBack;

	gl_FragColor = vec4( vec3(color.x*np.x, color.y*np.y, color.z*(sin(time)+1.)/2.), 1.0 );

}