/*
 * Original shader from: https://www.shadertoy.com/view/cdBGWy
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

void mainImage(out vec4 O, in vec2 C)
{
    O=vec4(0);
	vec3 p,r=iResolution,
    d=normalize(vec3((C-.5*r.xy)/r.y,1));
    float g=0.,e,s,t=iTime;
	for(float i=0.;i<99.;i++){
        p=d*g;
        p.z-=.1;
        p=R(p,vec3(.577),t*.2);        
        p-=i/5e4;     
        s=2.;
        for(int j=0;j<6;j++)
            p=abs(p--)-.1,
            s*=e=.01/dot(p,p),
            p*=e;
        g+=e=min(.1,length(cross(p,normalize(mix(vec3(1),H(t*.2),.4))*2.-1.)))/s;
        O.xyz+=mix(vec3(1),H(log(g)),.5)*.02/exp(i*i*e);
    }
    O*=O*O;    
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}