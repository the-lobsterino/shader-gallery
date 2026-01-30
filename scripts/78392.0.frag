/*
 * Original shader from: https://www.shadertoy.com/view/sslcRn
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
#define R(p,a,t) mix(a*dot(p,a),p,cos(t))+sin(t)*cross(p,a)
#define H(h) (cos((h)*6.3+vec3(0,23,21))*.5+.5)
void mainImage(out vec4 O, vec2 C)
{
    vec3 p,r=iResolution,c=vec3(0),
    d=normalize(vec3((C-.5*r.xy)/r.y,1));
    float s,e,g=0.,f,t=iTime;
	for(float i=0.;i<99.;++i)
    {
        p=g*d;
        p=R(p,vec3(.577),clamp(sin(t*.5)*3.,-2.,.5*cos(t*.3)));
        p.z+=t;
        p.z=asin(sin(p.z));
        s=3.;
        p=.8-abs(p);
        p.y<p.z?p=p.xzy:p;
        p.x<p.y?p=p.yxz:p;
        for(int i=0;i<8;++i)
            p=abs(p)-.9,e=dot(p,p),
            s*=e=2./min(e,2.+cos(t*2.)*1.5)+5./min(e,.8+cos(t)*.1),
            p=abs(p)*e-vec3(2,7,3);
        g+=e=length(p.yz)/s+.002;
        c+=mix(vec3(1),H(log(s)*.5+t*.2),.5)*.15/exp(i*i*e);  
    }
    c*=c*c;
    O=vec4(c,1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}