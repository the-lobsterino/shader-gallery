/*
 * Original shader from: https://www.shadertoy.com/view/sdS3zt
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
    for(float i=1.;i<90.;++i)
    {
        p=g*d-vec3(0,0,1.5);
        p=R(p,normalize(vec3(1,2.*sin(iTime*.1),3)),iTime*.2);
        s=5.;
        p=p/dot(p,p)+1.;
        for(int i=0;i<8;++i)
            p=abs(p-vec3(.8,2,1.5))-vec3(1,1.5,2.5),
            s*=e=1.6/clamp(dot(p,p),.2,1.5),
            p*=e;
        g+=e=abs(p.x)/s+1e-3;
        O.xyz+=mix(vec3(1),H(log(s)*.6),.8)*.001/e/i;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}