//noise function by chris liu
#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float f0(vec3 p){
	float a=sin(dot(p,vec3(123.456,234.567,345.678)))*456.789;
	return fract(a);
}
float f1(vec3 p){
	vec3 p0=vec3(floor(p.x),floor(p.y),floor(p.z));
	vec3 p1=vec3(floor(p.x)+1.0,floor(p.y),floor(p.z));
	vec3 p2=vec3(floor(p.x),floor(p.y)+1.0,floor(p.z));
	vec3 p3=vec3(floor(p.x)+1.0,floor(p.y)+1.0,floor(p.z));
	vec3 p4=vec3(floor(p.x),floor(p.y),floor(p.z)+1.0);
	vec3 p5=vec3(floor(p.x)+1.0,floor(p.y),floor(p.z)+1.0);
	vec3 p6=vec3(floor(p.x),floor(p.y)+1.0,floor(p.z)+1.0);
	vec3 p7=vec3(floor(p.x)+1.0,floor(p.y)+1.0,floor(p.z)+1.0);
	float r0=f0(p0);
	float r1=f0(p1);
	float r2=f0(p2);
	float r3=f0(p3);
	float r4=f0(p4);
	float r5=f0(p5);
	float r6=f0(p6);
	float r7=f0(p7);
	float s0=fract(p.x);
	float s1=fract(p.y);
	float s2=fract(p.z);
	s0=(sin(s0*PI-PI/2.0)+1.0)/2.0;
	s1=(sin(s1*PI-PI/2.0)+1.0)/2.0;
	s2=(sin(s2*PI-PI/2.0)+1.0)/2.0;
	float a0=r0*(1.0-s0)+r1*s0;
	float a1=r2*(1.0-s0)+r3*s0;
	float a2=a0*(1.0-s1)+a1*s1;
	float a3=r4*(1.0-s0)+r5*s0;
	float a4=r6*(1.0-s0)+r7*s0;
	float a5=a3*(1.0-s1)+a4*s1;
	float a6=a2*(1.0-s2)+a5*s2;
	return a6;
}
#define ITER 1
#define POWER 3
float f2(vec3 p){
	float a=0.0;
	for(int i=0;i<ITER;i++){
		a+=f1(vec3(p.xy*pow(2.0,float(i+POWER)),p.z+float(i)*0.5));
	}
	a/=float(ITER);
	return a;
}
void main(void){
	vec2 p=(gl_FragCoord.xy/resolution.xy);
	vec2 b=vec2(1.0)/resolution.xy*5.0;
	gl_FragColor=vec4(f2(vec3(p*2.0+vec2(-b.x,0.0),time*0.5)));
}
