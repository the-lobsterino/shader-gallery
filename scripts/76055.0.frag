/*
 * Original shader from: https://www.shadertoy.com/view/fdySWh
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
/**
    micro-marcher 10/17/21 @byt3_m3chanic
    it's a tiny shader - thats all.
    
    Thanks @dean_the_coder and @iapafoto!
*/

#define Q(a) mat2(cos(a+vec4(3,14,36,3)));
void mainImage(out vec4 O,vec2 F){O.xy=iResolution.xy;float d=0.,k=0.,T=iTime*.5;
for(float i=0.;i<1e3;++i){vec3 r,p=d*vec3((F-.5*O.xy)/O.y,1);p.yz+=T;p.xy=mod(p.xy+3.,6.)-3.;
k=round(p.z*.5);p.xy*=Q(k*6.-T)p.x=abs(p.x)-2.;p.z=mod(p.z+1.,2.)-1.;mat2 n=Q(k+T)p.yz*=n;p.xz*=n;
r=abs(p);p.xz*=Q(.7853)p=abs(p);p.y=r.y;d+=.0557*max(abs((min(p.x+p.z,r.x+r.z)+p.y-.6)),2e-5);}
O.xyz=1.-5e-3*d*vec3(9,5,3);}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}