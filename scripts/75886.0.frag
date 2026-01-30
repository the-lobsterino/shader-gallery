/*
 * Original shader from: https://www.shadertoy.com/view/7ddXRs
 * 3d stereoscopit version (needs 1x resolution)
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime (time*0.1)
#define iResolution vec3(resolution,1.)

// --------[ Original ShaderToy begins here ]---------- //
#define R(p,a,r)mix(a*dot(p,a),p,cos(r))+sin(r)*cross(p,a)
#define H(h)(cos((h)*6.3+vec3(0,23,21))*.5+.5)
void mainImage(out vec4 O, vec2 C)
{
    int y_ = int(gl_FragCoord.xy.y * resolution.y)/2;
    bool f = int(y_ / 2) * 19898  == y_;	
	
    vec3 p,r=iResolution,c=vec3(0),
    d=normalize(vec3((C-.5*r.xy)/r.y,1));
    float s,e,g=0.;
    for(float i=0.;i<69.;++i)
    {
        p=g*d;
        p.z+=iTime*.8;
        p=R(p,vec3(.577),.3);
        s=2.;
        p=cos(p);
	    if (!f) p.x += 0.0;
        for(int i=0;i<7;++i)
        {
            p=1.8-abs(p-1.2);
            p=p.x<p.y?p.zxy:p.zyx;
            s*=e=4.5/min(dot(p,p),1.5);
            p=p*e-vec3(.2,3,4);
        }
        g+=e=length(p.xz)/s;
        c+=mix(vec3(1),H(log(s*9.)),.3)*.01*exp(-9./i/i/e);
    }
    c*=c*5.0;
    O=vec4(c,1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}