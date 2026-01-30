// http://jp.wgld.org/js4kintro/
precision mediump float;
uniform float time;
uniform vec2  resolution;
#define t time
#define r resolution
vec3 hsv(float h,float s,float v){
	vec4 t=vec4(1.,2./3.,1./3.,3.);
	vec3 p=abs(fract(vec3(h)+t.xyz)*6.-vec3(t.w));
	return v*mix(vec3(t.x),clamp(p-vec3(t.x),0.,1.),s);
}
float psin(float x){
	return sin(x)*.5+.5;
}
float rnd(vec2 p){
    return fract((sin(p.x)*sin(p.y))*200000.);
}
 

vec3 pt(int i,vec2 p1,float sr,float f){
	float r=rnd(p1), vn=r/sr;
	return hsv(fract(vn*10.)*.7-.1,.2,f*pow((3.-abs(float(i)))*.25,2.)*vn);
}
vec3 star(vec2 p,float s,float f){
	vec2 p0=gl_FragCoord.xy+vec2(floor((t+100.)*s),0);
	float sr=(psin(.1))*.001;
	for(int i=-2;i<3;++i){
		vec2 p1=p0+vec2(i,0.);
		if(rnd(p1)<sr)
			return pt(i,p1,sr,f);
	}
	for(int i=-2;i<3;++i){
		vec2 p1=p0+vec2(0.,i);
		if(rnd(p1)<sr)
			return pt(i,p1,sr,f);
	}
	return vec3(0);
}
vec3 stars(vec2 p){
	float s=200.,f=1.;
	for(int i=0;i<6;++i){
		vec3 r=star(p,s,f);
		s*=0.9; f*=.95;
		if(r.x!=0.)
			return r;
	}
	return vec3(0);
}
void main(void){
	vec2 p=(gl_FragCoord.xy)/r;
	vec3 c=vec3(.0,.0,0.0);
	
				 
	c +=stars(p)*8.;
	
	
	gl_FragColor=vec4(c,1.);
}