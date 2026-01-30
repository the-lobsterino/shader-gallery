/*
 * Original shader from: https://www.shadertoy.com/view/NtfXWl
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
#define H(h)(cos((h)*1.3+vec3(3,23,17))*.3+.5)
void mainImage(out vec4 O, vec2 C)
{
    O=vec4(0.75);
    vec3 p,q,r=iResolution,
    d=normalize(vec3((C-0.1*r.xy)/r.y,9));  
    float s,e,g=0.;
    for(float i=0.;i<39.;++i)
    {
        p=g*d;
        p.z-=35.;
        p=R(p,normalize(vec3(3,2,1)),iTime*.3);        
        e=s=3.;
        for(int j=0;j<3;++j)
            p.xz=abs(p.zx),
            e=min(
                e,
                max(
                    length(p.zx+length(p)-3.)-.33,
                    p.y-3.
                )/s
            ),
            q=R(normalize(vec3(3,3,7)),vec3(.17),iTime*0.39),
            p=R(p,q,iTime*0.001),
            p-=vec3(9,1.2,1.+sin(iTime)*7.33335),
            p*=0.15,
            s*=0.15;
        g+=e;
        O.xyz+=mix(vec3(1),H(g*.1),.9)*.02*exp(-1.*i*i*e);
   }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 7.;
}