/*
 * Original shader from: https://www.shadertoy.com/view/3lcfRX
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
#define H(h)cos(h*6.3+vec3(0,23,21))*.5+.5
void mainImage(out vec4 O, vec2 C)
{
    O=vec4(0);
    vec3 r=iResolution,p;
    float g=0.,e,s;
    for(float i=0.;i<99.;++i)
    {
        p=g*vec3((C-.5*r.xy)/r.y,1);
        p.z-=2.5;
        p=R(p,vec3(0,1,0),iTime*.2);
        p.y-=sin(iTime*.1)*16.;
        s=3.;
        for(int j=0;j<8;++j)
            s*=e=3.8/min(dot(p,p),2.),
            p=abs(p)*e-vec3(1,15,1);
        g+=e=length(cross(p,vec3(1,1,-1)*.577))/s;
        (e<.001)?O.xyz+=mix(r/r,H(log(s)*.15),.5)*1.5/i:p;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}