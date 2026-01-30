/*
 * Original shader from: https://www.shadertoy.com/view/NlBfWW
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution,1.)

// --------[ Original ShaderToy begins here ]---------- //
#define B fract(t*2.)
#define R(p,a,t) mix(a*dot(p,a),p,cos(t))+sin(t)*cross(p,a)
#define H(h) (cos((h)*6.3+vec3(0,23,21))*.5+.5)

void mainImage(out vec4 O, in vec2 C)
{
	vec3 p,r=iResolution,
    d=normalize(vec3((C-.5*r.xy)/r.y,1)),
    c=vec3(0);
    float g=0.,e,s,t=iTime;
	for(float i=0.;i<99.;i++){
        p=d*g;
        p.z-=-t*2.;
        p=R(p,vec3(.577),clamp(sin(t/4.)*6.,-.5,.5)+.7);
        p=asin(sin(p/2.))*3.;  
        vec4 q =vec4(p,.5);
        s=2.;
        for(int i=0;i<8;i++){
            q=abs(q);
            q=q.x<q.y?q.zwxy:q.zwyx;
            s*=e=10./min(dot(q,q),7.);
            q=(q)*e-vec4(5,3.-B,5.-B,5);
        }
        g+=e=length(q.zw)/s;
        c+=mix(vec3(1),H(log(s)*.2),.8)*3e-4/e;
    }
    O=vec4(c*=c*c,1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}