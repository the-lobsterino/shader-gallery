/*
 * Original shader from: https://www.shadertoy.com/view/wtKBRd
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
    float g=0.,e,s;
    for(float i=1.;i<99.;++i)
    {
        p=g*d-vec3(0,-.25,1.3);
        p=R(p,normalize(vec3(1,8,0)),iTime*.1);
        s=3.;
        for(int i=0;i<4;++i) {
            s*=e=1./clamp(dot(p,p),.1,.6);
            p=vec3(2,4,2)-abs(abs(p)*e-vec3(3,5,1));
        }
        g+=e=min(length(p.xz)-.02,abs(p.y))/s+.001;
        O.rgb+=mix(vec3(1),H(log(s)/5.),.5)*pow(cos(i*i/64.),2.)/e/2e4;
     }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}