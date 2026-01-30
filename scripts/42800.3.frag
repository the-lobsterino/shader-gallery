#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

// based on the tuto here : http://www.karlsims.com/rd.html

vec2 cell(vec2 fragCoord, vec2 pixel)
{  
    vec2 uv = (fragCoord + pixel) / resolution;
    return texture2D(backBuffer, uv).rg;
}

vec2 laplacian2D(vec2 fragCoord) 
{
    float st = 1.;
    return 
        cell(fragCoord, vec2(0., -st)) * .2 +
        cell(fragCoord, vec2(0., st)) * .2 +
        cell(fragCoord, vec2(st, 0.)) * .2 +
        cell(fragCoord, vec2(-st, 0.)) * .2 +
        cell(fragCoord, vec2(-st, -st)) * .05 +
        cell(fragCoord, vec2(-st, st)) * .05 +
        cell(fragCoord, vec2(st, -st)) * .05 +
        cell(fragCoord, vec2(st, st)) * .05 -
        cell(fragCoord, vec2(0., 0.));
}

void main()
{
    vec2 uv = gl_FragCoord.xy / resolution;
    
    if(time<1.)
    {
	gl_FragColor = vec4(1,0,0,1);
	vec2 uvc = (gl_FragCoord.xy*2.-resolution)/min(resolution.x,resolution.y);
        if (length(uvc)<0.5)
            gl_FragColor = vec4(0,1,0,1);
    }
    else
    {
        vec2 diffusionCoef = vec2(1,.5);
        float feedCoef = 0.055;
        float killCoef = 0.061;
        
        vec2 ab = cell(gl_FragCoord.xy, vec2(0,0));
        vec2 lp = laplacian2D(gl_FragCoord.xy);
        
        float reaction = ab.x * ab.y * ab.y;
        vec2 diffusion = diffusionCoef * lp;
        float feed = feedCoef * (1. - ab.x);
        float kill = (feedCoef + killCoef) * ab.y;
        
        ab += diffusion + vec2(feed - reaction, reaction - kill);
        
    	gl_FragColor = vec4(ab,0.0,1.0);
    }
}