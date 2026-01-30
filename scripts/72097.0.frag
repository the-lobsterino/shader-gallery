/*
 * Original shader from: https://www.shadertoy.com/view/sslGWB
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
    vec3 p,q,r=iResolution,
    d=normalize(vec3((C-.5*r.xy)/r.y,1));  
    float s,e,g=0.;
    for(float i=0.;i<80.;++i)
    {
        p=g*d;
        p.z-=1.5;
        p=R(p,normalize(vec3(1,2,3)),iTime*.2);
        q=p;
        s=1.5;
        for(int j=0;j<8;++j)
            p=sign(p)*(1.2-abs(p-1.2)),
            p=p*(e=8./clamp(dot(p,p),.6,5.5))+q-vec3(.3,8,.3),
            s*=e;
        g+=e=length(p)/s;
        O.xyz+=.05*abs(cos(d+log(s)*.8))*exp(-1.5*i*i*e);
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}