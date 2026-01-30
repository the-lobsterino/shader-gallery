/*
 * Original shader from: https://www.shadertoy.com/view/NdXyz8
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
    vec3 p,r=iResolution,c=vec3(0),
    d=normalize(vec3((C-.5*r.xy)/r.y,1));
    float s,e,g=0.,t=iTime;
	for(float i=0.;i<99.;++i){
        p=g*d;
        p.z+=t*.2;
        p=asin(sin(p));
        p=R(p,cos(t*.2+vec3(1,8,3)),clamp(sin(t*.1)*3.,-5.,.5));
        s=3.;
        for(int j=0;j<7;++j)
            p=abs(p.zxy)-vec3(.7,.2,.4),
            s*=e=2./min(20.,dot(p,p)),
            p=p*e-vec3(.1,.12,.8);
        g+=e=min(length(p.z)+.05,length(p.xy)-.1)/s;
        c+=mix(vec3(1),H(log(s)*.3+t*.2),.3)*.01/exp(i*i*e);  
    }
    O=vec4(c,1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}