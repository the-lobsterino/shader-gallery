/*
 * Original shader from: https://www.shadertoy.com/view/XlXGRr
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
//yard deer by eiffie
#define size iResolution

float mld=0.,dL=0.;

//handy functions from IQ
float hash( vec2 n ){return fract(sin(dot(n*0.123,vec2(78.233,113.16)))*43758.351);}
float noise(in vec2 p){
	vec2 c=floor(p),f=fract(p),v=vec2(1.0,0.0);
	return mix(mix(hash(c),hash(c+v),f.x),
		mix(hash(c+v.yx),hash(c+v.xx),f.x),f.y);
}
float Tube(vec3 pa, vec3 ba, float r){return length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0))-r;}

const vec3 p1=vec3(-1.0,0.0,0.0),b1=vec3(2.0,0.0,0.0);
const vec3 p2=vec3(-1.5,1.0,0.0),b2=vec3(-0.4,0.0,0.0);
float DED(in vec3 z0,float oa){
	vec2 c=floor(z0.xz/6.0);
	z0.y+=0.5*sin(c.x+2.4*sin(c.y));
	z0.xz=mod(z0.xz,6.0)-3.0;
	float dM=max(3.25-max(abs(z0.x),abs(z0.z)),z0.y-1.25);
	float a=oa+c.x+c.y*2.3;
	z0.xz=cos(a)*z0.xz+sin(a+0.14+oa*0.3)*vec2(z0.z,-z0.x);
	vec3 z=z0;
	float body=Tube(z-p1,b1,0.5);
	float head=Tube(z-p2,b2,0.375);
	float neck=Tube(z-p1,p2-p1,0.325);
	z.xz=abs(z.xz)-vec2(1.0,0.4);
	z.y+=0.75;
	float leg=Tube(z-vec3(0.0,-0.75,0.0),vec3(0.0,1.25,0.0),0.15);
	float d=min(body,min(leg,min(head,neck)));
	z=mod(z0,0.4)-0.2;
	z=abs(z);
	float d2=min(z.x,min(z.y,z.z));
	dL=min(dL,length(vec2(d,max(z.x,max(z.y,z.z)))));
	body=length(vec2(d,d2));
	z=z0-p2;z.y-=1.3;
	d=length(vec2(length(z.zy)-1.0,z.x));
	z.y-=1.0;
	d=min(d,length(vec2(length(z.zy)-2.0,z.x)));
	d=max(d,z0.y-1.75);
	return min(0.9*min(body,d),dM);
}
float DE(in vec3 p){
	dL=100.0;
	//return DED(p);
	return min(DED(p,0.0),DED(p+vec3(3.0,0.0,2.0),1.0));
}
float rndStart(vec2 co){return 0.8+0.2*fract(sin(dot(co,vec2(123.42,117.853)))*412.453);}

mat3 lookat(vec3 fw,vec3 up){
	fw=normalize(fw);vec3 rt=normalize(cross(fw,up));return mat3(rt,cross(rt,fw),fw);
}

float fo(float t){return exp(-t*0.02);}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
	float zoom=2.0,px=2.0/(size.y*zoom);//find the pixel size
	float tim=time;
	
	//position camera
	vec3 ro=vec3(15.0+2.25*tim,5.0+sin(0.5*tim),3.0*tim);
	vec3 rd=normalize(vec3((2.0*fragCoord.xy-size.xy)/size.y,zoom));
	rd=lookat(vec3(sin(tim*0.7)*0.4+sin(tim*0.3)*0.6,-0.4+0.3*sin(tim*0.2),1.0),vec3(0.0,1.0,0.0))*rd;

	//march
	
	float tG=-(1.5+ro.y)/rd.y;//approx ground
	vec2 g=ro.xz+rd.xz*tG;
	float n=noise(g-vec2(5.0*tim*step(0.0,rd.y)))*0.1;
	g=g/6.0-vec2(0.5);
	float yp=sin(g.x+2.4*sin(g.y));
	tG+=yp*0.75;
	float t=(2.0-ro.y)/rd.y,d,dm=100.0,tm=0.0;
	t+=DE(ro+rd*t)*rndStart(fragCoord.xy);
	vec3 lc=vec3(1.0);
	mld=100.0;
	float MIN_DIST=px*0.1;
	for(int i=0;i<64;i++){
		d=DE(ro+rd*t);
		dL+=t*t*0.00002;
		if(dL<mld){
			vec2 p=ro.xz+rd.xz*t;
			mld=dL;
			float lh=0.2*sin(7.0*(p.x+sin(p.y)));
			lc=vec3(0.8+lh,0.8,0.8-lh);
		}
		if(d<dm){tm=t;dm=d;}//and save the max occluder
		t+=max(d,MIN_DIST);
		if(t>tG)break;
	}

	//color the ground 
	vec3 col=vec3(clamp((0.25-0.125*yp-0.75*rd.y+n)*fo(abs(tG)),0.0,1.0));
	if(rd.y<0.0){
		col.rb+=vec2(-0.01,0.01)*(yp+n*10.0);
		n=noise(g*1000.0);
		if(fract(n+rd.x+rd.z+rd.y+yp)>0.99)col+=vec3(exp(-abs(tG*0.18)));
	}else{col*=8.0*pow(rd.y,1.5);}
	
	//add in the deer
	if(dm<px*tm)col=mix(vec3(0.0,0.2,0.0)*fo(tm),col,clamp(dm/(px*tm),0.0,1.0));

	//add the lights
	col+=2.0*lc*exp(-mld*15.0);
	fragColor=vec4(col,1.0);
} 
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}