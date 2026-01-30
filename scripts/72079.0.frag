/*
 * Original shader from: https://www.shadertoy.com/view/7ssGRs
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
void mainImage(out vec4 O, vec2 C)
{
    O=vec4(0);
    vec3 p,q,r=iResolution,
    d=normalize(vec3((C-.5*r.xy)/r.y,1));  
    float s,e,g=.1;
    for(float i=1.;i<80.;++i)
    {
        p=g*d-vec3(.1,.2,1);
        p.z-=1.;
        p=R(p,normalize(vec3(1,2,3)),iTime*.2);
        q=p;
        s=2.;
        for(int j=0;j<8;++j)
            p-=clamp(p,-.9,.9)*2.,
            p=p*(e=3./min(dot(p,p),1.))+q,
            s*=e;
            g+=e=length(p)/s;
        O.xyz+=.03*abs(cos(d+.5+log2(s)*.6))*exp(-.3*i*i*e);
    }
    O.xyz=pow(O.xyz,vec3(1.8,1.,1.2));
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}