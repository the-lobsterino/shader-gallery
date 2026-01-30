/*
 * Original shader from: https://www.shadertoy.com/view/sd2GW3
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
#define PI (atan(1.)*4.)
#define R(p,a,r)mix(a*dot(p,a),p,cos(r))+sin(r)*cross(p,a)
#define H(h)(cos((h)*6.3+vec3(0,23,21))*.5+.5)
void mainImage(out vec4 O, vec2 C)
{
    O=vec4(0);
    vec3 p,r=iResolution,
    d=normalize(vec3((C-.5*r.xy)/r.y,1));
    float s,e,g=0.;
    for(float i=1.;i<90.;++i)
    {
        p=g*d;
        p+=vec3(0,0,iTime*.5);
        p=R(p,normalize(vec3(1,2,2)),.5);
        p=sin(p+3.*sin(p*.5));
        s=2.;
        for(int i=0;i<5;++i)
            p=abs(p-2.7)-1.3,
            s*=e=2./min(dot(p,p),1.5),
            p=abs(p)*e;
        g+=e=length(p)/s;
        O.xyz+=mix(vec3(1),H(log(s)*.2),.6)*.02*exp(-.3*i*i*e);
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}