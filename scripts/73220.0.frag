/*
 * Original shader from: https://www.shadertoy.com/view/stX3RB
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
#define ITERS 6

vec2 triangle_wave(vec2 a){
    return abs(fract((a/2.))-.5)*2.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    fragColor = vec4(0.0);
    vec3 col=vec3(0.0),col_prev=vec3(0.0);
    float t=0.0;
    vec2 uv = (fragCoord*10.0-iResolution.xy)/iResolution.y/15.0;
    uv += vec2((iTime)/30.0,iTime/70.0)*2.5;
    for(int c=0;c<ITERS;c++){
        float scale = 1.45;
        float scale1 = 1.1;
        float s1 = scale1*scale;
        col_prev = col;
        for(int i=0;i<ITERS;i++)
        {
            uv.x /= -scale1;
            uv= triangle_wave(uv+((vec2(uv.x/scale-uv.y/scale1,uv.y/scale-uv.x/scale1)/(scale))))/scale1;
            
            uv = triangle_wave(uv.yx/s1)*s1;
            uv.y *= scale1;
        }
        col[2] = abs((uv.y)-(uv.x));
        col = ((col+col_prev.yzx));
	}
    fragColor = vec4(vec3(col/float(ITERS)),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}