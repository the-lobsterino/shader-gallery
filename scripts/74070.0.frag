/*
 * Original shader from: https://www.shadertoy.com/view/ft2Xzz
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
    vec3 p,r=iResolution,
    d=normalize(vec3((C-.5*r.xy)/r.y,1));  
    float s,e,g=0.;
    for(float i=0.;i<160.;++i)
    {
        p=g*d;
        p.z+=iTime;
        s=3.;
        p=abs(mod(p,2.)-1.)-1.;
        p.x<p.z?p=p.zyx:p;
        p.y<p.z?p=p.xzy:p;
        for(int j=0;j<8;++j) {
            s*=e=2.5/clamp(dot(p,p),.3,1.3);
            p=abs(p)*e-vec3(.03,.4,20);
        }
        g+=e=length(p)/s;
        O.xyz+=mix(vec3(1),H(cos(log(s)))*.5,.8)*1e-4*i/e/s;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}