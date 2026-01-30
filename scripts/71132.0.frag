/*
 * Original shader from: https://www.shadertoy.com/view/Wl3BW8
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution,0.)

// --------[ Original ShaderToy begins here ]---------- //
#define R(p,a,r)mix(a*dot(p,a),p,cos(r))+sin(r)*cross(p,a)
#define H(h)cos(h*6.3+vec3(0,23,21))*.5+.5
void mainImage(out vec4 O, vec2 C)
{
    O-=O;
    vec3 r=iResolution,p;
    float g=0.,e,l,s;
    for(float i=0.;i<99.;++i)
    {
    p=g*vec3((C-.5*r.xy)/r.y,1);
    p=R(p,R(normalize(vec3(2,5,3)),vec3(.577),iTime*.3),.4);
    p.z+=iTime;
    p=mod(p-2.,4.)-2.;
    for(int k=0;k<3;++k)
        p=abs(p),
        p=p.x<p.y?p.zxy:p.zyx;
    s=2.;
    for(int j=0;j<5;++j)
        s*=l=2./clamp(dot(p,p),.1,1.),
        p=abs(p)*l-vec3(1,1,8);
    g+=e=length(p.xz)/s;
    e<.002?O.xyz+=mix(r/r,H(g),.5)*.8/i:p;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}