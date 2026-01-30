/*
 * Original shader from: https://www.shadertoy.com/view/wt3BR7
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
#define NUM_PARTICLES 100.

vec2 rotate(vec2 pos, float angle)
{
	float c = cos(angle);
    float s = sin(angle);
    
    return mat2(c,s,-s,c) * pos;

}


vec2 Hash12(float t)
{

    float x = fract(sin(t * 425.) * 389.);
    
    float y = fract(sin((t + x) * 545.) * 435.);
    
    
    return vec2(x,y);
}


vec2 Hash12Polar(float t)
{

    float a = fract(sin(t * 425.) * 389.) * 6.2832;
    float d = fract(sin((t + a) * 545.) * 435.);
    
    
    return vec2(sin(a), cos(a)) * d;
}


float Explosion(vec2 uv, float t)
{


    float sparks = 0.;
    for(float i = 0.; i< NUM_PARTICLES; i++)
    {
        vec2 dir= Hash12Polar(i) * .5;  
        float d = length(uv  - dir * t);
        float brightness = .0005;
        sparks += brightness/d;
    }
    
    return sparks;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord -.5 * iResolution.xy)/iResolution.y;
    
    uv.xy = rotate(uv.xy, iTime + abs(cos(iTime)) + abs(sin(iTime)));
    // Time varying pixel color
    vec3 col = vec3(0);
   
    vec3 color = abs( sin(vec3(.34, .55, .65) * floor(iTime))) * .5 + .5;
    col += Explosion(uv, abs(sin(iTime)) + .5 * cos(uv.x * iTime * uv.y * 5.)) * color;
    col *= (1.5);

    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}