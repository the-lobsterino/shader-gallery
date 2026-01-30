#ifdef GL_ES
precision mediump float;
#endif

// TDF4 by mitsuman
// Tokyo Demo Fest 2014, 7 Lines GLSL Graphics Compo
// http://www.pouet.net/party.php?which=1542&when=2014

//--------//--------//--------//--------//--------//--------//--------//--------
uniform float time;uniform vec2 resolution;void main(){float T=mod(time,60.)*.7
,M=7.*exp(-T*.25)*cos(T*.3),N=2.*exp(-T*.1)*sin(T),w=T*.3*N+3.;vec2 R=
resolution,P=(.5*R-gl_FragCoord.xy)/min(R.x,R.y);vec3 c,p=vec3(-cos(w)*P.x-sin(
w)*P.y,sin(w)*P.x-cos(w)*P.y,P.x+P.y);for(int i=0;i<64;++i){p+=vec3(sin(w*.1+p.
y*2.6),cos(w*.1+p.x*3.5-p.z*9.),-sin(p.x*2.))*M;if(p.x>-.3)c+=p*floor(mod((p.y<
-.2?.0:p.y<-0.1?30325.:p.y<0.?9541.:p.y<0.1?9591.:p.y<0.2?9793.:0.)*pow(2.,
floor(-5.-p.x*20.)),2.))*.15;}gl_FragColor=vec4(abs(c),1.);}
