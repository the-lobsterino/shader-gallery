/*
 * Original shader from: https://www.shadertoy.com/view/WlGBzc
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution,1.)

// --------[ Original ShaderToy begins here ]---------- //
void mainImage(out vec4 O, vec2 C)
{
    O=vec4(0);
    vec3 p,r=iResolution,
    d=normalize(vec3((C-.5*r.xy)/r.y,1));  
    float g=0.,e,s;
    for(float i=0.;i<99.;++i)
    {
        p=g*d;
        p-=vec3(0,-.9,1.5);
        r=normalize(vec3(1,8,0));
        s=iTime*.2;
        p=mix(r*dot(p,r),p,cos(s))+sin(s)*cross(p,r);
        s=2.;
        s*=e=3./min(dot(p,p),20.);
        p=abs(p)*e;
        for(int i=0;i<4;++i)
            p=vec3(2,4,2)-abs(p-vec3(4,4,2)),
            s*=e=8./min(dot(p,p),9.),
            p=abs(p)*e;
        g+=e=min(length(p.xz)-.15,p.y)/s;
        e<.001?O+=3.*(cos(vec4(3,8,25,0)+log(s)*.5)+3.)/dot(p,p)/i:O;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}