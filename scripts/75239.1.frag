/*
 * Original shader from: https://www.shadertoy.com/view/fsGGWG
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// ================================================================================================
//
// The MIT License
// Copyright © 2021 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Signed distance to a 2D tunnel shape

// List of some other 2D distances:
//
//    https://www.shadertoy.com/playlist/MXdSRf
//
// and
//
//    www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm

float dot2( vec2 v ) { return dot(v,v); }

// general solution (see sdTunnel2() below)
float sdTunnel( in vec2 p, in vec2 wh )
{
    p.x = abs(p.x); p.y = -p.y;
    vec2 q = p - wh;

    // base
    float d1 = dot2(vec2(max(q.x,0.0),q.y));
    
    // arc and sides
    q.x = (p.y>0.0) ? q.x : length(p)-wh.x;
    float d2 = dot2(vec2(q.x,max(q.y,0.0)));

    // closest
    float d = sqrt( min(d1,d2) );
    
    // in/out
    return (max(q.x,q.y)<0.0) ? -d : d;
}


// interior distance is coorect only if wh.y>wh.x
float sdTunnel2( in vec2 p, in vec2 wh )
{
    if( p.y>=0.0 ) wh.y = wh.x;
    float r = (p.y<0.0)?0.0:wh.x;
    vec2  q = abs(p)-wh+r;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = (2.0*fragCoord-iResolution.xy)/iResolution.y;
//    vec2 m = (2.0*iMouse.xy-iResolution.xy)/iResolution.y;

    p.y -= 0.272;
    float w = max(0.0, sin(10.0))*0.5+0.25;
    float h = max(0.0,-sin(10.0))*0.5+0.50;

	float d = sdTunnel2( p, vec2(w,h) );

    vec3 col = vec3(1.0) - sign(d)*vec3(0.1,0.4,0.7);
	col *= 1.0 - exp(-3.0*abs(d));
	col *= 0.8 + 0.2*cos(150.0*d);
	col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.01,abs(d)) );

    //if( iMouse.z>0.001 )
    //{
    //d = sdTunnel( m, vec2(w,h) );
    //col = mix(col, vec3(1.0,1.0,0.0), 1.0-smoothstep(0.0, 0.005, abs(length(p-m)-abs(d))-0.0025));
    //col = mix(col, vec3(1.0,1.0,0.0), 1.0-smoothstep(0.0, 0.005, length(p-m)-0.015));
    //}

	fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}