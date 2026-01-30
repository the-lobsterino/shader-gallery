/*
 * Original shader from: https://www.shadertoy.com/view/wl2XD3
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
float rnd(vec2 u, vec2 f)
{
    vec4 a = fract(sin(dot(f,vec2(37.34,97.74)))
                   *vec4(6925.953,7925.953,8925.953,9925.953));
    vec2 b = cos(a.x*6.2831+vec2(0.,1.57)+iTime*(a.z-.5));
    return cos(dot(u,b*a.y*6.)+a.w*6.2831)*.5+.5;
}
float bub(vec2 u)
{
    return max(cos(min(length(u)*3.4641,3.141))*.5+.5,0.);
    //return exp(dot(u,u)*-4.);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 u = 16.*(2.0*fragCoord.xy-iResolution.xy)/iResolution.y;
    
    vec2 s = vec2(2.,1.73205080757);
    vec2 a0 = (u+s*vec2(.0 ,.0))/s;
    vec2 a1 = (u+s*vec2(.5 ,.0))/s;
    vec2 a2 = (u+s*vec2(.25,.5))/s;
    vec2 a3 = (u+s*vec2(.75,.5))/s;
    vec2 a0f = fract(a0)*s-s*.5;
    vec2 a1f = fract(a1)*s-s*.5;
    vec2 a2f = fract(a2)*s-s*.5;
    vec2 a3f = fract(a3)*s-s*.5;
    fragColor = vec4(bub(a0f)*rnd(u,floor(a0)+.0)+
                     bub(a1f)*rnd(u,floor(a1)+.1)+
                     bub(a2f)*rnd(u,floor(a2)+.2)+
                     bub(a3f)*rnd(u,floor(a3)+.3));
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}