/*
 * Original shader from: https://www.shadertoy.com/view/3lyBDw
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
#define R(p,a,r)mix(a*dot(p,a),p,cos(r))+sin(r)*cross(p,a)
#define H(t)(cos((vec3(0,2,-2)/3.+t)*6.24)*.5+.5)
#define D(a)length(vec2(fract(log(length(a.xy))-iTime*.5)-.5,a.z))/3.-.005*pow(l,.03)
void mainImage(out vec4 O, vec2 C)
{
    O=vec4(0);
    vec3 p,r=iResolution;
    float g=0.,e,l;
    for(float i=0.;i<99.;++i)
    {
        p=R(g*normalize(vec3((C-.5*r.xy)/r.y,1.))-vec3(0,0,6),
            normalize(vec3(1,2,0)),
            iTime*.2
        );
        l=length(p);
        g+=e=min(min(D(p),D(p.zxy)),D(p.yzx));    
        e<.005?O.xyz+=mix(vec3(1),H(l),.7)/i:p;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}