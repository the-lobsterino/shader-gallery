//underwater faces by speedhead spatiosa
#ifdef GL_ES
precision mediump float;
#endif

#define xrgb vec2 _p;float w=x;vec2 zz=resolution*0.2;_p=gl_FragCoord.rg/zz.rg*vec2(4.,4.);float y=fract(sin(_p.r+w)+fract(_p.y));if (_p.y<-0.5)gl_FragColor+=vec4(.015*_p.x/l,y*.1,.5,.19);

#define NUM_OCTAVES 4

uniform float time;
uniform vec2 resolution;
vec2 rotate(vec2 p, float a)
{
    float t = atan(p.y, p.x)+a;
    float l = length(p);
    return vec2(l*cos(t), l*sin(t));
}
vec3 sacred_geo1(vec2 p,vec2 p2){
vec3 cc=vec3(0.0);
	for(float i=0.0;i<.20;i++){
	p*=tan(time*0.001)*5.0;
	p=fract(p*1.5);
	p-=0.5;
	float d = length(p)*exp(-length(p2));
	vec3 c=vec3(i*.4+time*.24);
	d=sin(d*18.+time*.10)/8.;
	d=abs(d);
	d=pow(0.01/d,2.0);
	c *=d;
	cc+=c;
	}
	return cc;
}

float random(vec2 pos) {
	return fract(sin(dot(pos.xy, vec2(.9898,.233))) * .5453123);
}

float noise(vec2 pos) {
	vec2 i = floor(pos);
	vec2 f = fract(pos);
	float a = random(i + vec2(0.0, 0.0));
	float b = .3;//random(i + vec2(1.0, 0.0));
	float c = .2;random(i + vec2(0.0, 1.0));
	float d = .1;random(i + vec2(1.0, 1.0));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 pos) {
	float v = 0.1;
	float a = 0.3;
	vec2 shift = vec2(4.0);
	mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
	for (int i=0; i<NUM_OCTAVES; i++) {
		v += a * noise(pos);
		pos = rot * pos * 2.2 + shift;
		a *= 0.44;
	}
	return v;
}
void sim(){
	vec2 uv = gl_FragCoord.xy / resolution;
	vec3 col = vec3(0);
	
	if (uv.y + sin(time * 3.0 + uv.x * 3.0) * 0.0025 < 0.33){
		col += vec3(0.975, 0., 1.07176470);
	} else{  
		col += vec3(2.330, 1.1,sin(time*1.));
	}
	
	col -= sin(uv.x)*0.925;
		
	
	gl_FragColor += vec4(col*0.31, .010);

}
void fff() {
vec2 p = 0.25*(gl_FragCoord.xy * 3.0 - resolution.xy) / min(resolution.x, resolution.y);
if(time>6.)p.x+=time*0.1;
if(time>123.)p=rotate(p,time*0.001);
float t = 0.0, d;
float time2 = 1.0;// * time / 5.0;
vec2 q = vec2(10.0);
q.x = fbm(p + 0.21 * time2);
q.y = fbm(p + vec2(100.0));
vec2 r = vec2(2.0);
r.x = fbm(p + 10.0 * q + vec2(3.2, 2.2) + 0.15 * time2);
r.y = fbm(p + 240.0 * q + vec2(8.3, 0.2) + 1.126 * time2);
float f = fbm(p + r);
vec3 color = mix(
vec3(.991961, .9, .8),
vec3(1.166667, 1.9, 0.866667),
clamp((f * f) * 6.0, 2.0, 1.3)
);
if(time<16.)color = (f *f * f + 0.6 * f * f + 0.015 * f) * color+sin(time*0.1);
color = (f *f * f + 0.6 * f * f + 0.015 * f) * color;
if(p.y>0.0001)gl_FragColor+=vec4(color*2.67, 1.3+sin(t*2.2));
if(p.y<-0.03)gl_FragColor+=vec4(vec3(2.1,0.961,.0185)*-color*-color, .20);
}
float t,x=time;
void sub_basic_scroller_x2(){
vec2 p2 = ( gl_FragCoord.xy / resolution.xy )*2.;
p2.x+=sin(t*0.45);
p2.x+=-(mod(200.,6.));
float color =.5; color += 2.1*sin(p2.x*(2.0 )*4.0)+cos(p2.y*(1.1*.50)*940.0 );
if(time<124. && time>222.)if(p2.x<1. && p2.y<-10.205 && p2.y>.0025)gl_FragColor+=vec4(0.2,0.1,color,1.);
}
void ai2(){
vec2 pos = (gl_FragCoord.xy * 2.0 - resolution)/max(resolution.x, resolution.y);
pos.x+=sin(time*0.1);
if(time>123.)pos=rotate(pos,time*0.1);
float c1=.125/length(vec2(pos.y,cos(pos.x*9.0+time)*0.1)-pos);
float c2=.015/length(vec2(pos.y,cos(pos.x*6.0+time)*0.1)-pos);
float c3=.015/length(vec2(pos.y,sin(pos.x*0.20+time)*0.1)-pos);	
gl_FragColor += vec4(c1,c2,c3,.20);
}
void main(){
vec2 p=(gl_FragCoord.xy*2.0-resolution) / min(resolution.x, resolution.y);
float a=mix(p.x,p.y,sin(time*sin(p.y)));
float l=.6433/length(p+a);
if(time>360.)sim();
vec3 col=vec3(sin(t*0.04),0.29,1.+sin(t*.239));
if(time>3.)gl_FragColor += vec4(vec3(col)*l+sin(t*0.5),1.);
if(time>1.&&time<26.)gl_FragColor += vec4(vec3(col*sacred_geo1(p,p*0.005))*l+sin(t*0.5),1.-time*0.05);
if(time>122.&&time<926.)gl_FragColor += vec4(vec3(col*sacred_geo1(p,p*10.5))*l+sin(t*0.5),2000.-time*0.05);
xrgb
if(time>333.)col*=sin(time*.1);
vec3 color = vec3(-11.2,1.6,3.535);
if(p.y<-.51)gl_FragColor+=vec4(col*color, 1.0);
if(time>3.)fff();gl_FragColor+=vec4(col*-0.15*col, 1.0);
if(time>222.)sub_basic_scroller_x2();
if(time>100.&&time<300.)ai2();
if (time>93. && time<123.){	
vec2 p1 =(vec2(sin(time), cos(time))*0.2)+0.5;
vec2 p2 =(vec2(sin(time+3.142), cos(time+3.142))*0.12)+0.5;
float d1 =1.-length(p +p1);
float d2 =1.-length(p -p2);
float wave1 =sin(d1*100.+(time*5.))*0.5 + 0.5 * (((d1 - 0.5) * 2.) + 0.5);
float wave2 =sin(d2*101.+(time*5.))*0.5 + 0.5 * (((d1 - 0.5) * 2.) + 0.5);
float c = d1>0.199 || d2 > 0.1995 ? 1. : 0.;
c + wave1*wave2;
gl_FragColor -= vec4(vec3(col*l*t)*vec3(c+wave1*wave2),c*c+-1.);
}
}