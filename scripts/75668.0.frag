/*
 * Original shader from: https://www.shadertoy.com/view/7dcSzS
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
    float ,s,e,g=3.;
    for(float i=0.;i<90.;++i)
    {
        p=g*d;
        p=R(p,normalize(vec3(1,2,3)),iTime*.1);
        p.z-=iTime*.3;
        s=5.;
        p=sin(p);
        p=R(p,r/r,.3);
        for(int i=0;i<6;++i)
            p=.9-abs(p-.8),
            s*=e=1.1/dot(p,p)-.02,
            p*=e;
        g+=e=abs((dot(p,r/r)-1.5)/s)+.001;
        O.xyz+=mix(vec3(1),H(dot(p,p)*1.8),.8)*.04*exp(-.3*i*i*e);
    }
    O*=O;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}