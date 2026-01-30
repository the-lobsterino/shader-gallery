precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_INV 0.3183098861837907
#define PI2_INV 0.15915494309189535
#define GRAD(f,p,d) (vec3(f(p+vec3(d,0.,0.))-f(p-vec3(d,0.,0.)),f(p+vec3(0.,d,0.))-f(p-vec3(0.,d,0.)),f(p+vec3(0.,0.,d))-f(p-vec3(0.,0.,d)))/(d*2.))
const vec3 ex=vec3(1.,0.,0.),ey=vec3(0.,1.,0.),ez=vec3(0.,0.,1.);
vec3 hsv2rgb(float h,float s,float v){return (1.-(1.-clamp(abs(mod(h*6.+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.))*s)*v;}
vec3 hsv2rgb(vec3 p){return hsv2rgb(p.x,p.y,p.z);}
float atan2(float y,float x){return x==0.?(step(.0,y)-0.5)*PI:atan(y/x)+step(.0,-x)*PI;}
float atan2(vec2 p){return atan2(p.y,p.x);}
vec3 perspective(vec3 dir,float fov,vec2 p){vec3 f=normalize(dir),r=normalize(cross(f,ey));return normalize(f+(r*p.x+ey*p.y)*atan(fov*.5));}
mat3 rotate(float angle,vec3 axis){vec3 a = normalize(axis);float s=sin(angle),c=cos(angle),r=1.-c;return mat3(a.x*a.x*r+c,a.y*a.x*r+a.z*s,a.z*a.x*r-a.y*s,a.x*a.y*r-a.z*s,a.y*a.y*r+c,a.z*a.y*r+a.x*s,a.x*a.z*r+a.y*s,a.y*a.z*r-a.x*s,a.z*a.z*r+c);}

float d_sphere(vec3 p,float r){
	return length(p)-r;
}
float d_box(vec3 p,vec3 size){
	vec3 v=abs(p)-size;
	return max(v.x,max(v.y,v.z));
}

float f_floor(vec3 p){
	return max(dot(ey, p+ey*5.),-d_sphere(p-vec3(-2.,-4.,-4.),4.));
}
float f_obj1(vec3 p){
	return min(
		d_sphere(vec3(mod(p.x+7.,14.)-7.,p.y,p.z),1.),
		d_sphere(p-rotate(time,ey)*ex*4.,1.)
	);
}
float f_obj2(vec3 p){
	return min(
		d_box(p-vec3(6.,-1.,-8.),vec3(1.,5.,1.)),
		d_box(p-vec3(4.,-5.5,1.),vec3(2.))
	);
}
float f(vec3 p){
	return min(f_floor(p),min(f_obj1(p),f_obj2(p)));
}

void main() {
	vec2 p=(gl_FragCoord.xy-resolution*.5)/resolution.y;
	
	const vec3 light=vec3(-1.,10.,3.);
	
	vec3 pos=rotate((mouse.x*2.-1.)*PI,ey)*-ex*50.+ey*(mouse.y*40.-2.);
	vec3 ray=perspective(-pos,PI*0.25,p);
	float d;
	for(int i=0;i<64;i++){
		d=f(pos);
		pos+=ray*d;
	}
	if(d>=.0001&&ray.y<-.001){
		pos+=ray*(pos.y+5.)/ray.y;
		d=0.;
	}
	if(d<.0001){
		vec3 color=
			f_obj1(pos)<.0001 ? ex:
			f_obj2(pos)<.0001 ? ez:
			vec3(.9+step(1.,abs(floor(mod(pos.x/6.,2.))-floor(mod(pos.z/6.,2.))))*.1);
		
		vec3 n=GRAD(f,pos,.0001);
		float lk0=max(0.2,dot(n,normalize(light)));
		ray=normalize(light);
		pos+=n*.1;
		float lk=1000000.;
		float depth=0.;
		for(int i=0;i<32;i++){
			d=f(pos);
			if(d<.0001){
				lk=0.;
				break;
			}
			depth+=d;
			lk=min(lk,d*8./depth);
			pos+=ray*d;
		}
		lk=clamp(lk,.2,1.);
		gl_FragColor=vec4(color*min(lk0,lk),1.);
	}else{
		gl_FragColor=vec4(ez*-ray.y,1.);
	}
}