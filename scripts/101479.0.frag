/*
 * Original shader from: https://www.shadertoy.com/view/lslBz7
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define V vec3
#define W vec2
#define S sin(p.x+sin(p.y))

mat2 m = .1*mat2(8,6,-6,8);
float h,s,t;

float g(W p){
    h=abs(S); p*=m;
	return h+S;}

float n(W p){
    p*=.1;
    s=5.,t=.9;
	for(int i=0;i<9;++i) t-=s*.1*g(p), s*=.4, p=p*m*2.1+t;
    return 3.-exp(t);}

void mainImage(out vec4 O,W U)
{
    float e,v=iTime*.2,u=sin(v),x=.0,p=x,o=x;
	V r=V(U/iResolution.xy-1.,0),z,y;
	for(int d=0;d<200;++d)        
        if (p/5e3<=x)
			z=V(0,-.8*g(W(0,v)),v/.1)+p*normalize(V(r.x-u,r.y*.3+.1,2)),
            x=z.y+n(z.xz),p+=x,o++;
    x=n(z.xz);
    O.xyz = .1*(dot(V(-.5),normalize(V(n(z.xz-W(.01,0))-x,0,n(z.xz-W(0,.01))-x-n(z.zx*11.)/5e2)))*
        n(z.zx*6.)*V(1,2,3)+1.+o/50.+log(p));

}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}