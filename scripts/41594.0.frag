#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#pragma author afl_ext

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define xtime time*0.01
mat2 RM = mat2(cos(xtime), -sin(xtime), sin(xtime), cos(xtime));
#define X(a,x,y) cos(time+distance(a,vec2(x,y)))
#define Q(p) (X(p,3202.,393.)+X(RM*p,-0112.,11.)+X(RM*RM*p,-65.,-231.)+X(RM*RM*RM*p,-2034.,-46.)+X(RM*RM*RM*RM*p,365.,-939.))*.4
#define N(a,b,c) Q(a*b)*c
#define F(p) N(p,1.,.5)+N(p,2.,.25)+N(p,4.,.125)+N(p,8.,.065)+N(p,16.,.032)

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	gl_FragColor = vec4(F( position*100.0 + 2.0 * F(-position*66.0)));

}