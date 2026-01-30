
#ifdef GL_ES
precision mediump float;
#endif
// Kind of a RedHat for the Linux 4k demo ;-)
// Not2self : missing the black band and a TUX! 
//  For fun - not profit

uniform float time;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution
void f(out vec4 v,in vec2 g){float f=iTime/12.,s=sin(f)/10.0,i=10000.,o=-10000.,t=iResolution.r/400.,e=g.r/t;vec3 a=vec3(0.);for(float r=-64.;
r<=64.;r++){float m=5.0625*r*r,c=e-r-200.;if(c*c<20736.-m){float l=sqrt(c*c+m)*s,n=(sin(l)+sin(t*3.)*.4)*56.,b=t*(120.+n-r*cos(f)-c*sin(f)/2.);
if(b<i){if(abs(b-g.g)<1.5)a+=vec3(2.,0.,0.)*smoothstep(-1.5,1.5,1.5-abs(b-g.g));i=b-1.;
}if(b>o){if(abs(b-g.g)<1.5)a+=vec3(1.,0.,0.)*smoothstep(-1.5,1.5,1.5-abs(b-g.g));o=b+1.;}}}v=vec4(a,1.);}void main(){f(gl_FragColor,gl_FragCoord.rg);}