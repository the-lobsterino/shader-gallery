precision lowp float;uniform float time;uniform vec2 resolution;
#define q u=_;_-=.5;_.r*=r.r/r.g;z+=.05;l=length(_*-_);u-=_/l*(sin(z)+1.)*abs(sin(l*_*1.-z-z));c[i]=.005/length(mod(u*u.x,.5)-.5);}gl_FragColor=vec4(c/l,x);
#define __ void main(){float x=time;vec3 c;vec2 r=resolution;vec4 g=gl_FragCoord;float l,z=x;for(int i=0;i<3;i++){vec2 u,_=g.rg/r;q}//{__=q/3.14}
   //\    ______    o__      .  __o
__//_\\__|__||__|   |     ||      |
 //___\\    ||      /\    ||     /\
//     \\__ || __P TENNIS v2 (3Lines by speedhead/(B)/spatiosa)	