#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// custom font , Xavierseb 2019

#define _ mat4( vec4(-1.3,-1.3,1.3,1.3), vec4(-1.), vec4(0.), vec4(-1.))
#define UP mat4( vec4(0.), vec4(10.), vec4(0.), vec4(10.))
#define A mat4( .75,-1.32,-1.44,.75,.77,1.95,-2.28,-.59,.75,1.05,.32,1.,-.59,1.82,.78,-1. )
#define B mat4( -1.,.3,-1.66,-.8, .2,3.3,5.,-1., -1.,.6,2.,-.8, .2,2.6,-1.6,-1.)
#define C mat4( .8,-.5,-2.1,.94, .8,1.8,-1.8,-.8, .7,-.5,-2.1,.94, .8,1.8,-1.8,-.8)
#define D mat4( .64,-.8,-1.8,.74, .78,1.9,-1.7,-.86, .74,1.3,-.63,1., -.43,4.8,3.8,0.)
#define E mat4( -.8,2.8,-.65,-.8, 0.,-.27,2.3,-.1, -.8,-.82,-.92,1., -.1,-.32,-1.2,-1.)
#define F mat4( -.33,2.54,-.69,-.12,2.38,1.94,5.28,-.99, -.5,-.5,.5,.5,1.,1.,1.,1.)
#define G mat4( .9,-.4,-2.3,.84, .34,2.4,-1.8,-.99, .9,1.,-1.,-.9, 0.,-4.7,-3.5,-2.9)
#define H mat4( -1.,.9,-1.1,-.75, .43,4.5,3.4,-.5, -.75,-.24,.78,.94, -1.,3.7,-1.35,-1.)
#define I mat4( 0.,-.14,-1.19,.64, .8,-.48,-1.07,-1., -.05,.43,-.34,.07, 2.88,2.71,2.67,2.86)
#define J mat4( 0.,-.3,-1.,-.8, .5,-5.19,-1.7,-2.5, -.05,.43,-.34,.03, 2.88,2.71,2.67,2.96)
#define K mat4( -.94,.58,-1.1,-.94, .6,4.35,3.6,-1.05, .4,-2.4,.3,.8, .8,0.,0.,-1.)
#define L mat4( -.4,1.,.3,-.17, -.95,1.2,3.8,2.8, -.17,-.8,.38,.84, 2.8,1.8,-1.,-.95)
#define M mat4( -.9,-.9,-.33,0., -1.,1.6,1.6,-.7, 0.,.33,.9,.9, -.7,1.6,1.6,-1.)
#define N mat4( -1.07,-.64,-.9,-.76, .35,.93,.85,-1., -.75,-.9,.7,.94, -1.,.85,1.9,-1.)
#define O mat4( 0.,-1.1,-1.1,0., 1.,.82,-.8,-1., 0.,1.1,1.1,0., -1.,-.8,.82,1.)
#define P mat4( -1,-.43,-.58,-.73, .43,1.5,-1.9,-3., -.7,.83,1.75,-.7, .8,1.9,-1.75,-.8)
#define Q mat4( .7,-.83,-1.75,0., .8,1.9,-1.75,-.8, .7,-.5,-.54,.93, .26,-2.7,-4.76,-2.5)
#define R mat4( -.88,-.28,-.43,-.5, .86,1.5,-.67,-1., -.5,-.54,.22,.9, -1.,1.,1.,.8)
#define S mat4( .78,-.7,-1.5,0., .88,1.34,.55,0., 0.,1.5,.67,-.9, 0.,-.55,-1.35,-.8)
#define T mat4( -.55,.35,-1.37,.76, 3.,1.16,-1.1,-1., -1.,-.7,-1.4,.9, 1.64,1.54,1.7,1.7)
#define U mat4( -.9,-1.1,1.,.72, .9,-1.6,-1.7,.9, .72,.7,1.,1.4, .9,-1.6,-1.,-.77)
#define V mat4( -1.,-.83,-.236,0., .88,1.5,-.73,-1., 0.,1.55,-.25,1., -1.,1.8,.9,.65)
#define W mat4( -.9,-1.2,-.33,0., .9,-1.6,-1.6,.7, 0.,.33,.9,.9, .7,-1.6,-1.6,.9)
#define X mat4( .83,.25,-.3,-1., .95,.6,-.5,-1., -.9,.48,-.43,1., .87,.35,-.5,-1.)
#define Y mat4( -.9,-.2,.9,.9, .9,-2.9,0.,.9, .9,-.37,-1.,-.9, .2,-4.7,-3.5,-2.9)
#define Z mat4( -.9,1.1,1.3,0., .9,.9,1.5,0., 0.,-1.3,-1.1,.9, 0.,-1.5,-.9,-.9)
#define LV mat4( 0.,-.45,-2.,0., .58,1.4,1.,-1., 0.,2.,.45,0., -1.,1.,1.4,.58)
#define QU mat4( -.66,2.7,-.3,-.05, 2.9,3.3,1.6,.58, -.05,.43,-.34,.03, -.42,-.59,-.63,-.44)
#define ST mat4( -.3,1.1,2.,-1.,1.,-1.13,-.27,0., -1.,1.87,1.21,-.3,0.,.96,2.03,-1.)
#define NN mat4(0)
#define _G mat4( vec4(-1,-1,1.75,1.75), vec4(-1), vec4(-1,-1,1.75,1.75), vec4(-1))
#define BG mat4( 1,-3.8,-1.14,1.53, 2.3,3.5,-3.5,0, 1.53,1.54, 1.75,.54, 0.,.97,.59,.66)

#define BOUNDINGBOX_W 1.1
#define BOUNDINGBOX_H 1.32
#define CHAR_W .04
#define CHAR_H .08
#define THICKNESS .7
#define TEST(X2,X3) distance(getPos(nn,X2*CHAR_W,X3*CHAR_H),pos)
#define TEST1(X2,X3) distance(getPos(nn.wzyx,X2*CHAR_W,X3*CHAR_H),pos)
#define IS_INSIDE pos.x<BOUNDINGBOX_W && pos.x>-BOUNDINGBOX_W && pos.y<BOUNDINGBOX_H && pos.y>-BOUNDINGBOX_H
#define DO_TEST(t_,ux,uy) nn=getN(t_); c = min(c,min(TEST(ux,uy),TEST1(ux,uy)));
#define a2z_1(ux,uy)  { DO_TEST(t-.005,ux,uy) DO_TEST(t-.015,ux,uy) DO_TEST(t-.025,ux,uy); DO_TEST(t-.035,ux,uy); }
#define a2z0(ux,uy)  { DO_TEST(t-.01,ux,uy) DO_TEST(t-.03,ux,uy); if(c<.02) a2z_1(ux,uy); }
#define a2z1(ux,uy)  { DO_TEST(t-.02,ux,uy);  if(c<.04) a2z0(ux,uy); }
#define a2z(ux,uy,color)  if(IS_INSIDE) for(float t=0.;t<.52;t+=.04) { float c1=c; vec4 nn; DO_TEST(t,ux,uy) if(abs(c)<.0002)break; else if(c<.04&&t>0.) a2z1(ux,uy) ; if(c<c1) col=color; }

#define  mx( u, v, t)  mix(u,v,clamp(t1-t,0.,1.))
#define  mx2( u, v, t)  mix(u,v,clamp((t1-t)/2.,0.,1.))
#define  mx3( u, v,t)  mix(u,v,clamp((t1-t)*4.,0.,1.))
#define  A2Z(X,color) pos+=pstep; a2z((gl=X)[0],gl[1],color) a2z(gl[2],gl[3],color)  
#define  A2L(X,color) if((gl=X)[0]==LV[0]) gl*=heartbeat;  A2Z(gl,color)  

mat4 mix(in mat4 u,in mat4 v, in float t) { return v*t+u*(1.-t); }   // comment this line out if error or mix is already implemented for mat4
vec4 getN(in float t) {	float t1=1.-t; return vec4(t1*t1*t1, 3.*t1*t1*t, 3.*t1*t*t, t*t*t); }
vec2 getPos(in vec4 n, in vec4 x, in vec4 y) { return vec2(dot(x,n), dot(y,n)); }

#define  T1 mod(time/2., 9.);
//#define  mx( u, v, t)  mix(u,v,clamp(t,0.,1.))
#define tim mod(time/4.,314.)
void main( void ){
	vec2 pos = gl_FragCoord.xy/resolution.xy -vec2(0., sin(tim*8.+(gl_FragCoord.xy/resolution.xy).x*4.)/15.),pstep;
	float c=1., x=-.4, t1=4., heartbeat=(2.-max(1.2,.5+sin(t1*5.)))*1.6, co=cos(max(6.,t1*2.-6.)),si=sin(max(6.,t1*2.-6.));  
	vec4 col=vec4(1);
	mat4 gl;
	pos += vec2(-.1,-.65); pstep=vec2(-.11,.0);
	vec2 op = pos;

	// a2z ( x-position, offset (draw 1, 2 or more times depending on extents), char data )
	A2Z(mx(_G,mx(BG,_G,7.5),1.),vec4(0,0,1,1)) 
	A2Z(mx(_,mx(O,_,7.5),1.),vec4(1,0,0,1)) 
	A2Z(mx(_,mx(O,_,7.5),1.),vec4(.9,.9,0,1)) 
	A2Z(mx(_,mx(G,_,7.5),1.),vec4(0,0,1,1)) 
	A2Z(mx(_,mx(L,_,7.5),1.),vec4(0,.9,0,1)) 
	A2Z(mx(_,mx(E,_,7.5),1.),vec4(1,0,0,1)) 
	pos = op;pos += vec2(-.2, .4);
	A2Z(mx(_,mx(S,_,7.5),1.),vec4(.5,.5,.5,1))		
	A2Z(mx(_,mx(U,_,7.5),1.),vec4(.5,.5,.5,1))		
	A2Z(mx(_,mx(C,_,7.5),1.),vec4(.5,.5,.5,1))		
	A2Z(mx(_,mx(K,_,7.5),1.),vec4(.5,.5,.5,1))		
	A2Z(mx(_,mx(S,_,7.5),1.),vec4(.5,.5,.5,1))		

	float mc=1.-sin(smoothstep(c*c+.00455,.0,.002));
  	
	gl_FragColor =  c<.0317? pow(abs(mc), 3.)*col*11.:vec4(1);
}