/*
 * Original shader from: https://www.shadertoy.com/view/WdfBRS
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

// --------[ Original ShaderToy begins here ]---------- //
#define t iTime
#define Rt mat2(cos(.5*t+vec4(0,33,11,0)))
#define _f(p)(1./6.)*sin(cos(t*fract(.14*t))+12.566*pow((sqrt(fract(.3*t)+.5-dot((1./13.)*p,p))),3.))
float f(vec3 p){
vec3 b=abs(p)-vec3(2);
return max(max(b.x,max(b.y,b.z)),max(_f(p),_f((mod(p*2.,2.)-1.))));
}
void mainImage(out vec4 O,in vec2 U){
vec2 R=iResolution.xy,e=vec2(.001,0);
U=(U-.5*R)/R.y;O.xyz=.7*vec3(0.1,Rt*sin(floor(20.*fract(sin(2.*t)*2.*U.y+t)+30.*U.x)));
vec3 p,o=vec3(0,0,-7),L=normalize(vec3(5.*sin(t),5.*cos(t),1));
for(int i=32;i>0;--i){p=o;p.xy*=Rt;p.yz*=Rt;o+=vec3(U,1)*f(p);}
if(o.z<1.){vec3 N=normalize(f(p)-vec3(f(p-e.xyy),f(p-e.yxy),f(p-e.yyx)));
O.xyz=max(sin(6.*t+fract(.1*o.z))*vec3(.9,.4,.2)*exp2(.5*(2.-dot(p+L,p+L))),.5*vec3(.2,.5,.6)*max(0.,dot(N,p-L)));}
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}