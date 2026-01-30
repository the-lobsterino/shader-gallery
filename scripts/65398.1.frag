// 110620N modifcation
// Original: https://twitter.com/h_doxas/status/1257010732702535688

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define r resolution
#define t time*0.1

#define M(z)mat2(cos(z+vec4(0,33,11,0)))
#define F(w)for(float i=1.;i<8.;++i){w}

void main(){
	vec4 o = vec4(1.0);
	o.xy=(gl_FragCoord.xy*2.-r)/r.y;
	o.z=atan(o.x,o.y)+.4;
	o.xy*=M(floor(o.z/.8)*.8);
	F(o.xy=abs(o.xy)-1.+sin(t*.1+.1); o.xy*=M(cos(t)*sin(t));)
	F(o.xyz+=abs(.1*i/(o.y+sin(o.x*i)*i*cos(t)));)
	gl_FragColor = fract(o);
}