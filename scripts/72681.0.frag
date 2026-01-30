/*
 * Original shader from: https://www.shadertoy.com/view/fdSSzR
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
#define ITERS 9
const float scale = 2.7;
const float scale1 =-1.175;
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    fragColor = vec4(0.0);
    vec3 col=vec3(0.0),col_prev=vec3(0.0);
    float t=0.0;
    vec2 uv = (fragCoord*10.0-iResolution.xy)/iResolution.y/15.0;
    uv.y += (iTime)/25.0;
    for(int c=0;c<ITERS;c++){
        float s1 = scale1*scale;
        col_prev = col;
        for(int i=0;i<ITERS;i++)
        {
            
            uv= fract(-uv-((vec2(uv.x/scale-uv.y/scale1,uv.y/scale+uv.x/scale1)/(scale))))/scale1;
            uv.x *= scale1;
            uv = fract(-uv.yx/s1)*s1;
            uv.y /= -scale1;
        }
        col[2] = abs(fract(uv.y)-fract(uv.x));
        col = ((col+col_prev.yzx))/2.125;
	}
    fragColor = vec4(vec3(col*3.0),1.0);
    
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}