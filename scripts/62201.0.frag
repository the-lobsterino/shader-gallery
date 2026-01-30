#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define PI 3.1415926

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;

vec2 pos;

float line(vec2 a,vec2 b){
	vec2 _1=a-b;
	vec2 pa=pos-a,pb=pos-b;
	if(dot(pa,pb)>0.)return 0.;
	float d=(_1.x*pa.y-_1.y*pa.x)/length(_1);
	return abs(d)<.03?1.:0.;
}
float ff(float x,float y){
	#if 1
	bool r=x<0.;
	if(r)x=-x;
	float s;
	s+=1.;
	float k=1.,j=1.;
	for(int a=1;a<39;a++){
		s+=(k*=x)/(j*=float(a));
	}
	if(r)return y-1./s;
	return y-s;
	#endif
	return y-exp(x);
}
void main( void ) {
	
	pos =surfacePosition;;
	vec2 size=surfaceSize;
	
	vec3 c;
	if(abs(pos.x)<.002*size.x||abs(pos.y)<.002*size.y)c.r=1.;
	
	float t=fract(time)*7.;
	
	c.g+=abs(ff(pos.x,pos.y))<0.003*size.x?1.:0.;
	
	
	gl_FragColor = vec4(c,1.0 );
}