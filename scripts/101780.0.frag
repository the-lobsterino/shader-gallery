/*
 * Original shader from: https://www.shadertoy.com/view/7dfyR7
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
#define R(p,a,t) mix(a*dot(p,a),p,cos(t))+sin(t)*cross(p,a)
#define H(h) (cos((h)*6.3+vec3(0,23,21))*.5+.5)

void mainImage(out vec4 O, vec2 C)
{
    vec3 p,q,r=iResolution,c=vec3(0),
    d=normalize(vec3((C-.5*r.xy)/r.y,1));
    float s,e,g=0.,t=iTime;
	for(float i=0.;i<90.;i++){
        p=g*d;
        p.z-=12.+sin(t*.3)*2.;
        p=R(p,normalize(cos(t*.3+vec3(1,8,3))),clamp(sin(t*.1)*3.,-5.,.5));
        p=abs(p);
        q=p;
        s=2.;
        for(int i=0;i<8;i++)
            p=1.-abs(abs(abs(p-4.)-1.)-2.),
            s*=e=-12./clamp(dot(p,p),.4,5.),
            p=p*e+q;
        g+=e=length(cross(p,vec3(.577)))/s-.002;
        c+=mix(vec3(1),H(log(s)*.3+t*.3),.4)*.015/exp(i*i*e);  
    }
    c*=c;
    O=vec4(c,1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}