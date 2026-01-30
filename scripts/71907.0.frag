/*
 * Original shader from: https://www.shadertoy.com/view/fdfGR8
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
    vec3 q=vec3(3,3,.0),
    p,r=iResolution,
    d=normalize(vec3((C-.5*r.xy)/r.y,1));
    float s,e,g=.3;
    for(float i=0.;i<99.;++i)
    {
        p=g*d-vec3(.4,.1,.8);
        p=R(p,normalize(vec3(1,2,3)),-iTime*.1);
        s=2.;
        for(int i=0;i<7;++i) {
            s*=e=15./min(dot(p,p),15.),
            p=abs(p)*e-2.;
            p=q-abs(p-q*.4);
        }
        g+=min(10.,length(p.xz)-.5)/s;
        O.xyz+=cos(vec3(7,6,9)/log(s*.2))*.02;
    }
    O.xyz=pow(O.xyz,vec3(1.5,3.6,.2));
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}