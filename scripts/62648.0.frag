/*
 * Original shader from: https://www.shadertoy.com/view/4sBSDz
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
// Created by Bart Verheijen 2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.


float circleFill(vec2 pos, float radius)
{
    return clamp(((1.0-(length(pos)-radius))-(1.0-3.0/iResolution.y))*(iResolution.y/3.0), 0.0, 1.0);   
}

vec4 smiley(vec2 pos, float scale)
{
    vec4 result = vec4(0.0, 0.0, 0.0, circleFill(pos, 0.5*scale));
    float c = circleFill(pos, 0.45*scale);
    if (c>0.0) {
        result += vec4(c, c, 0.0, 0.0);
    }
    c = circleFill(vec2(pos.x*1.5+(0.24*scale),pos.y-(0.12*scale)), 0.14*scale);
    if (c>0.0) {
        result -= vec4(c, c, 0.0, 0.0);
    }
    c = circleFill(vec2(pos.x*1.5-(0.24*scale),pos.y-(0.12*scale)), 0.14*scale);
    if (c>0.0) {
        result -= vec4(c, c, 0.0, 0.0);
    }

    if (pos.y<-0.08*scale)
    {
    	float c1 = circleFill(vec2(pos.x,pos.y-(0.04*scale)), 0.36*scale);
    	float c2 = circleFill(vec2(pos.x*0.9,pos.y-(0.04*scale)), 0.30*scale);
    	if (c1>0.0) {
        	result -= vec4(c1, c1, 0.0, 0.0);
    	    if (c2>0.0) {
        	    result += vec4(c2, c2, 0.0, 0.0);
    	    }
    	}
    }
    return result;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0 * uv;
    p.x *= iResolution.x / iResolution.y;

    //vec4 background = vec4(uv,0.5+0.5*sin(iTime),1.0);

    vec2 center = vec2(p.x + 1.2*cos(iTime/10.0), p.y + 1.2*sin(iTime/10.0));
    float cotan = atan(center.y, center.x);
    float spot  = clamp(1.3 - 20.0 * length(center), 0.0, 1.0);
    vec4 background = vec4(clamp(10.0*sin(cotan*13.0 + iTime*3.0)-8.0, 0.0, 1.0) + spot,
                           clamp(10.0*sin(cotan*17.0 + iTime*2.5)-8.0, 0.0, 1.0) + spot,
                           clamp(10.0*sin(cotan*19.0 + iTime*2.0)-8.0, 0.0, 1.0) + spot, 1.0);
    
    
    
    for (float i=0.0; i<8.0; i++)
    {
        float seed  = ((i+3.0)*(i+3.0) + floor(iTime*1.1+i/8.0));
        float rest  = fract(iTime*1.1+i/8.0);
        seed        = mod(seed*seed*seed, 114.0);
        vec2 pos    = vec2(floor(seed/6.0)/19.0*3.3 - 1.5, fract(seed/6.0)*1.7-0.7);
        //vec2 pos    = vec2(fract(y*y*y/10.0)*3.5 - 1.5, fract(y*y*(y+.5)/14.)*1.6-0.8);
        float scale = 0.7 * sin(rest*2.0 + 1.1415);
    	vec4 sprite = smiley(p - pos, scale);
    	background  = background * (1.0 - sprite.a) + sprite * sprite.a;
    }
        
    fragColor = background;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}