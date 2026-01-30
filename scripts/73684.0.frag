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
#define iTime time
#define iResolution vec3(resolution,1.)

// --------[ Original ShaderToy begins here ]---------- //
#define R(p,a,r)mix(a*dot(p,a),p,cos(r))+sin(r)*cross(p,a)
#define H(h)(cos((h)*6.3+vec3(0,23,21))*.5+.5)
void mainImage(out vec4 O, vec2 C)
{
    O=vec4(0);
    vec3 p,r=iResolution,n=vec3(-.5,-.809,.309),
    d=normalize(vec3((C+C-.5*r.xy)/r.y,1));  
    float e,g=0.;
    for(float i=0.;i<99.;++i)
    {
        p=g*d;
        p.z-=10.;
        p=R(p,normalize(vec3(41,2,2)),iTime*.9);
        for(int j=0;j<5;j++)
            p.xy=abs(p.xy),
            p-=2.*min(0.,dot(p+p-p,n+n-n))*n+n*n;
        p.z=fract(log(p.z)-iTime*.5)-.5;
        g+=e=length(p.yz)-.01;
        O.xyz+=mix(vec3(1)+vec3(5),H(dot(p,p/p/p)*5.5),.4)*.05*exp(-.05*i*i*e)/vec3(5);
	O.w  = 1.0;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}