#define _rgb vec2 _p;float w=x;vec2 zz=resolution;_p=gl_FragCoord.rg/zz.rg*vec2(4.,4.);float y=fract(sin(_p.r+w)+fract(_p.y));gl_FragColor+=vec4(.15*_p.y/l,y*.1,.5,.19);
#define _ uv=p;p.x+=sin(x);p-=.5;p.x*=r.x/r.y;z+=.1;l=length(p);uv+=p/l*(sin(z)+1.)*abs(sin(l*2.-z-z));c[i]=.01/length(mod(uv,.5)-.25);} _rgb gl_FragColor+=vec4(c,x);
#define __ precision lowp float;uniform float time;uniform vec2 resolution; void main(){float x=time*.5;vec3 c;vec2 r=resolution;vec4 g=gl_FragCoord;float l,z=x;for(int i=0;i<3;i++){vec2 uv,p=g.rg/r;_}
   ///another 3 liner from speedhead spatiosa
__///__
 ///