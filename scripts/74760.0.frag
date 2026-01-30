/*
 * Original shader from: https://www.shadertoy.com/view/wlyfDG
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution ,0.1)

// --------[ Original ShaderToy begins here ]---------- //
#define R(p,a,r)mix(a*dot(p,a),p,cos(r))+sin(r)*cross(p,a)
#define H(h)(cos((h)*10.3+vec3(0,83,21))*.7+.25)
void mainImage(out vec4 O, vec2 C)
{

	O=vec4(0);
    vec3 p,r=iResolution,
    d=normalize(vec3((C-.5*r.xy)/r.y,1));
    float g=0.,e,s,a;
    for(float i=1.;i<99.;++i)
    {
        p=g*d-vec3(-.8,.2,2);
        p=R(p,normalize(vec3(10,1,1)),iTime*.1);
        s=3.;
        for(int i=0;i<5;++i) {
            p=vec3(8,4,2)-abs(p-vec3(9,4,2)),
            s*=e=8./clamp(dot(p,p),.1,4.);
            p=abs(p)*e;
        }
        g+=e=min(length(p.xz),p.y)/s+.001;
        a=cos(i*i/40.),O.rgb+=mix(vec3(1),H(log(s)/5.),.5)*a*a/e/2e4;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}