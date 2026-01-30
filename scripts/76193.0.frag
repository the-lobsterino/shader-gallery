/*
 * Original shader from: https://www.shadertoy.com/view/7ddXRs
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
    vec3 p,r=iResolution,c=vec3(0),
    d=normalize(vec3((C-.5*r.xy)/r.y,1));
    float s,e,g=0.;
    for(float i=0.;i<69.;++i)
    {
        p=g*d;
        p.z+=iTime;
        p=R(p,vec3(0.1),0.1);
        s=2.;
        p=cos(p);
        for(int i=0;i<13;++i)
        {
            p=1.8-abs(p-1.2);
            p=p.x<p.y?p.zxy:p.zyx;
            s*=e=4.5/min(dot(p,p),1.5);
            p=p*e-vec3(.2,3,4);
        }
        g+=e=length(p.xz)/s;
        c+=mix(vec3(1),H(log(8.)),.3)*.01*exp(-9./i/i/e);
    }
    c*=c*3.;
    O=vec4(c,1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}