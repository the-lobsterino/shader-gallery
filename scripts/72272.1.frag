/*
 * Original shader from: https://www.shadertoy.com/view/fsf3Wf
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
#define H(h)(cos((h)*6.3+vec3(0,23,21))*.5+.5)
void mainImage(out vec4 O, vec2 C)
{
    O=vec4(0);
    vec3 p,q,r=iResolution,
    d=normalize(vec3((C-.5*r.xy)/r.y,1));  
    float s,e,g=0.;
    for(float i=1.;i<90.;++i)
    {
        p=g*d-vec3(-.2,.3,2.5);
        p=R(p,normalize(vec3(1,2.*sin(iTime*.1),3)),iTime*.2);
        q=p;
        s=4.;
        for(int j=0;j<6;++j)
            p=sign(p)*(1.-abs(abs(p-2.)-1.)),
            p=p*(e=6./clamp(dot(p,p),.1,3.))-q*vec3(2,8,1)-vec3(5,2,1),
            s*=e;
        g+=e=length(p)/s;
        O.xyz+=.1*H(log(s)*.1+.2)*exp(-2.*i*i*e);
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}