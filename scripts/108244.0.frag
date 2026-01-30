#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;


// ————— juhax games snow remix——————
float t=time*9.;
vec3 jsnow(vec2 uv,float scale,float spd,float spd2,vec3 col){	
	uv+=time/scale;uv.y+=t*spd/scale;uv.x+=cos(uv.y+t*spd2)/scale;
	uv.x+=t*.09;
	vec2 s=floor(uv),f=fract(uv),p;
	float k=3.,d;
	p=.5+.35*cos(101.1*fract(tan((s+p+scale)*mat2(75,33,26,5))*5.2))-f;
	d=length(p);k=min(d,k);
	k=smoothstep(0.1,k,sin(f.x+f.y)*.022);
    	return k*col;
}
// ———————————————————————————————————

void main(void){
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	vec3 fc=vec3(0.);
	vec3 c=vec3(0.);
	c+=jsnow(uv,320.,1.5,.5,vec3(0.25,0.2,0.9));
	c+=jsnow(uv,25.,0.4,.8,vec3(0.35,0.2,0.6));
	c+=jsnow(uv,200.,0.3,.5,vec3(0.45,0.2,0.7));
	c+=jsnow(uv,15.,0.3,.5,vec3(0.5,0.4,0.9));
	c+=jsnow(uv,110.,0.2,.5,vec3(1.5,0.8,0.9));
	c+=jsnow(uv,5.,0.4,.5,vec3(0.8,0.6,0.9));
	c+=jsnow(uv,2.,0.3,.5,vec3(1.5,0.2,0.39));
	fc=(vec3(c));
	gl_FragColor = vec4(fc,2);
}
