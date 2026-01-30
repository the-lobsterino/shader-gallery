#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;

varying vec3 v_normal;
varying vec2 v_texcoord;

// 190622 awesome work!


// Adapted from:
// https://twitter.com/zozuar/status/1461524656532471811

#extension GL_OES_standard_derivatives : enable

precision highp float;

\
mat2 rotate2D(float r)
{
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float city(vec2 FC, vec2 r, float t) 
{
    float e = 0.0, l = 0.0, y = 0.0, o = 0.0;
    vec3 p, q, d = vec3( ( FC.xy - 0.5 * r) / r.y, -1 );
    
    d.xz *= rotate2D( t * 0.02 );
    e = max( min( ++y, -e ), y - 3.0 );
    
    for( float i = 0.0; i < 55.0; i++ )
    {
    if( i >52.0 )
    {
        //  unused?
            //l=log(e+=1e-2)/1e1;
        //d/=d; 
    }
    else
    {
        //  fractal here?
        o += exp( -e * 1e2 ) / 2e1;
    }
    p = (q += d * e *0.35+fract(spectrum.y*(.08*mouse.y)));
        p++;
        y = p.y;
    
    //  Adjust lim, step to affect geometry generation
    //for( float a2 = 3.0; a2 > 0.04; a2 += .6)
        for (float a2 = 0.0; a2 < 7.0; a2++)
    {
            float a = 3.0 * pow(0.6, a2);
            p.xz *= rotate2D(3.0);
            p = abs( p ) - a;
            e = min( e, max( p.x-.04+pow(spectrum.z,2.-mouse.y), max( p.y/sin(mouse.x)+mouse.x, p.z-mouse.x) ) );
    }
        e = max( min( ++y, -e ), y - 4.0 );
    }
    o += l;
    return o;
}

void main()
{
    float color = city( gl_FragCoord.xy, resolution.xy, time );
    gl_FragColor = vec4( vec3( color ), 1.0 );
}