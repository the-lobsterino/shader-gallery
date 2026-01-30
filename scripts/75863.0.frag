/*
 * Original shader from: https://www.shadertoy.com/view/st2GRd
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime (time*1.01+3.0)
#define iResolution vec3(resolution,1.)


// --------[ Original ShaderToy begins here ]---------- //
#define R(p,a,r) mix(a*dot(p,a),p,cos(r))+sin(r)*cross(p,a)
#define H(h) (cos((h)*6.3+vec3(0,23,21))*.5+.5)
void mainImage(out vec4 O, vec2 C)
{

    int y = int(C.y);
    bool f = int(y / 2) * 2  == y;
    if (f) C.x = C.x + 2.1;
	
	
    O=vec4(0);
    vec3 p,r=iResolution,n=vec3(-.5,-.808,.309),
    d=normalize(vec3((C-.5*r.xy)/r.y,1));  
    float e,g=0.;
    for(float i=0.;i<29.;++i)
    {
        p=g*d;
        p.z-=10.;
	 
	 
        p=R(p,normalize(vec3(1.0,2,2)),iTime*-0.004);
	if (!f) p.x += 0.1;
        for(int j=0;j<5;j++)
            p.xy=abs(p.xy),
            p-=2.*min(0.,dot(p,n))*n;
        p.z=fract(log(p.z)-iTime*-.0042)-.5;
        g+=e=length(p.yz)-.01;
        O.xyz+=mix(vec3(1),H(dot(p,p)*.5),.7)*.05*exp(-.05*i*i*e);
	O.w  = 1.0;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}