/*
 * Original shader from: https://www.shadertoy.com/view/tt3fRn
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution,0.)

// --------[ Original ShaderToy begins here ]---------- //
#define PI acos(-1.)
#define A(p,n)length(p)*sin(vec2(0.,PI*.5)+mod(atan(p.y,p.x),PI*2./n)-PI/n)
#define F(p,v)p-2.*min(0.,dot(p,v))*v;
#define R(p,a,r)mix(a*dot(p,a),p,cos(r))+sin(r)*cross(p,a)
#define Q(t, a)floor(t*a)/a
#define hash(n)fract(sin(n+1234.5)*55555.)

void mainImage(out vec4 O, vec2 C)
{
    O-=O;
    vec3 r=iResolution,p;
    vec2 U=(C-.5*r.xy)/r.y;
    float i,g=0.,e=1.,l,s,
    q=Q(fract(U.y+iTime*.5),30.);
    U.x+=.1*sin(iTime*8.+q*10.)*
        step(hash(floor(iTime*2.))*.4+.6,hash(q))*
        step(.9,sin(iTime*2.+3.*sin(iTime*5.)));
    for(float ii=0.;
        ii<=99.;
        ++ii
        )
    {
        if (e<=.0005) break;
        p=g*vec3(U,1);
        p.z-=-.6;
        p=R(p,normalize(vec3(3,2,1)),iTime*.1);
        s = 4.;
        for(int i=0;i<15;i++)
        {
            p.y+=.15;
            p.xz=abs(p.xz);
            p.xy=A(p.xy,12.);
            p.y-=.11;
            p.xy=F(p.xy,normalize(vec2(1,-.85)));
            p.y=.15-abs(p.y);
            p.xz=abs(p.xz);
            p.yz=F(p.yz,normalize(vec2(2,-1)));
            p.x-=.53;
            p.yz=F(p.yz,normalize(vec2(1,-1)));
            p-=vec3(1.7,.38,.0);
            l=2.3*clamp(1.3/dot(p,p),0.,1.);
            p*=l;
            p+=vec3(1.8,.7,.05);
            s*=l;
        }
        g+=e=length(p)/s;
        ++i;
    }
    O.xyz+=mix(vec3(1),cos(vec3(1,8,15)+p*8.+log(s*4.)),.4)*180./i/i;
    O *= sin(U.y*250.-iTime*5.)*.2+.9;
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}