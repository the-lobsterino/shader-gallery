#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 hash3( vec3 p ) {
       vec3 p3 = fract(vec3(p.xyz) * vec3(34.1031, 77.1030, 254.0973));
       p3 += dot(p3, p3.yzx+19.19);
       return fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
	}


//noise from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

//by modrony

float gdist(vec3 ro, vec3 rd, in vec3 p1, in vec3 p2){
	p1-=ro;
	p2-=ro;
	float dots=(dot(p1,p1)-dot(p2,p2))/2.;
	float mult=dot(p1-p2,rd);
	return dots/mult;
}



void toplane(vec3 ro,vec3 rd, 
	     in vec3 p1_id,in vec3 p2_id, 
	     inout vec3 norm_enter, inout vec3 norm_leave, 
	     inout float edist, inout float ldist){
	vec3 p1=vec3(0.0);
	vec3 p2=p2_id;
	float dist=gdist(ro,rd,p1,p2);
 	if (dot(p1-p2,rd)<=0. && dist<ldist){
	    float odist=ldist;
            ldist=dist;
	    norm_leave=normalize((p1-p2));
	}
	if (dot(p1-p2,rd)>=0. && dist>edist){
	    float odist=edist;
	    edist=dist;
	    norm_enter=normalize(p2-p1);
	}
}


vec3 seed=vec3(8013.23,77.33,198.1);
vec3 r_orbit(float sp){
	vec3 m = hash3(seed);
	seed=m;
        vec3 a1=normalize(hash3(m)-0.5);
	vec3 a2=normalize(hash3(m+a1)-0.5);
	a2-=a1*dot(a1,a2);
	a2=normalize(a2);	
	float ma=cos(sp*m.z*0.31417*time);
	float mb=sin(sp*m.z*0.31417*time);
        vec3 o=(ma*a1)+(mb*a2);
	return normalize(o);
}
float light(vec3 v){
	return noise(v);
	vec3 l=normalize(vec3(1.0));
 return clamp(dot(normalize(v+2.*l),l),0.0,1.0);
}
vec3 planes(inout vec3 x, in vec3 ro, in vec3 rd, inout vec3 norm, inout vec3 exit, inout float fdist, inout vec3 cout)
{
    
    
    norm=vec3(1.0);
    vec3 id1=vec3(0.);
    float ldist1=8000.;
    float edist1=0.;
    vec3 norm_leave1;
    vec3 norm_enter1;
    	
    vec3 norm_leaver;
    vec3 norm_enterr;
    float ldistr=8000.;
    float edistr=0.;
	
    vec3 norm_leaveg;
    vec3 norm_enterg;
    float ldistg=8000.;
    float edistg=0.;
	
    vec3 norm_leaveb;
    vec3 norm_enterb;
    float ldistb=8000.;
    float edistb=0.;
	
    vec3 rvec,gvec,bvec,ror,rob,rog;
	
    cout=vec3(0.);
    float ra=1.0;
    float ba=1.0;
    float ga=1.0;
    float rfall=0.6;
    float gfall=0.6;
    float bfall=0.8;

    float refr=0.7;
    float refg=0.73;
    float refb=0.96;

    const int MAXK=4;
    for( int K=0; K<MAXK+1; K++ ){ 
        seed=vec3(908120.77777,01833.366858,58785.5467); 
	    edistr=-200.;
	    edistg=-200.;
	    edistb=-200.;
	    ldistr=800.;
	    ldistg=800.;
	    ldistb=800.;
	//vec3 epoint=ro+rd*edist1;
        for( int L=0; L<50; L++ ){    
        	vec3 o = r_orbit(0.2);
		o.x*=0.6;
		
		if (K==0){
			toplane(ro,rd,
				id1,o,
				norm_enter1, norm_leave1,
				edist1,ldist1);
			
			rvec=refract(rd,norm_enter1,refr);
			gvec=refract(rd,norm_enter1,refg);
			bvec=refract(rd,norm_enter1,refb);
			ror=ro+rd*edist1;
			rog=ror;
			rob=ror;
			
		}else{
    			toplane(ror,rvec,
				id1,o,
				norm_enterr, norm_leaver,
				edistr,ldistr);
    			toplane(rog,gvec,
				id1,o,
				norm_enterg, norm_leaveg,
				edistg,ldistg);
    			toplane(rob,bvec, 
				id1,o,
				norm_enterb, norm_leaveb,
				edistb,ldistb);
			//ldistr-=edistr;
			//ldistg-=edistg;
			//ldistb-=edistb;
	}}
	    if (K>0 && K<MAXK){
		    ra*=clamp(pow(rfall,ldistr-edistr),0.0,1.0);
		    ga*=clamp(pow(gfall,ldistg-edistg),0.0,1.0);
		    ba*=clamp(pow(bfall,ldistb-edistb),0.0,1.0);
		    float exit;
		    exit=clamp(abs(dot(norm_leaver,rvec)),0.1,1.0)*0.4;
		    cout.x+=ra*exit*light(norm_leaver);
		    ra-=ra*exit;
		    exit=clamp(abs(dot(norm_leaveb,bvec)),0.1,1.0)*0.4;
		    cout.z+=ba*exit*light(norm_leaveb);
		    ba-=ba*exit;
		    exit=clamp(abs(dot(norm_leaveg,gvec)),0.1,1.0)*0.4;
		    cout.y+=ga*exit*light(norm_leaveg);
		    ga-=ga*exit;
		    
		    ror=ror+rvec*(ldistr+noise(ror*1.2)*0.2);
		    rob=rob+bvec*(ldistb+noise(rob*1.2)*0.2);
		    rog=rog+gvec*(ldistg+noise(rog*1.2)*0.2);
		    rvec=reflect(rvec,norm_leaver);
		    gvec=reflect(gvec,norm_leaveg);
		    bvec=reflect(bvec,norm_leaveb);
	    }    
	}
	
	cout.x+=(ra)*light(norm_leaver);///pow(ldistr*rfall,2.);
	cout.y+=(ga)*light(norm_leaveg);///pow(ldistg*gfall,2.);
	cout.z+=(ba)*light(norm_leaveb);///pow(ldistb*bfall,2.);
		  
	
    fdist=ldistr-edistr;
    if(ldist1<edist1) return vec3(20.); 
    norm=normalize(norm_enter1); 
    exit=normalize(norm_leaver);
    
    x.x=edist1;
    return id1;
}


void dpoint(vec3 ro, vec3 rd, inout vec4 c){
	c=vec4(
		vec3(
			clamp(light(rd),0.,1.0)
		)*0.5+0.5,1.0);//default
	vec3 p; 
	vec3 norm;
	vec3 nn=norm;
	vec3 ex;

	
	float pdist=0.0;
	vec3 cout=vec3(0.0);
	vec3 gout=vec3(0.0);
	vec3 bout=vec3(0.0);
	
	vec3 voron=planes(p,ro,rd,nn,ex,pdist,cout);
	if (voron.x>1.0) {return;}
	
	
	vec3 seet = cout;
	vec3 spec=vec3(
		clamp( light(reflect(rd*2.,nn))*0.5,0.0,1.0));
       	vec3 color = clamp(seet+spec,0.,1.0);
	c = vec4(color, 1.);

}
void main( void ) {
	vec2 uv = surfacePosition*2.0;
	vec3 ro = vec3(0.,0., 20);
	vec3 rd = vec3(uv*0.03, -1);
	float m=mouse.x*3.14179*4.;
	ro.xz=vec2(cos(m)*ro.x+sin(m)*ro.z,cos(m)*ro.z-sin(m)*ro.x);
	rd.xz=vec2(cos(m)*rd.x+sin(m)*rd.z,cos(m)*rd.z-sin(m)*rd.x);
	m=mouse.y*3.14179*2.;
	ro.yz=vec2(cos(m)*ro.y+sin(m)*ro.z,cos(m)*ro.z-sin(m)*ro.y);
	rd.yz=vec2(cos(m)*rd.y+sin(m)*rd.z,cos(m)*rd.z-sin(m)*rd.y);
        rd=normalize(rd);
		
        dpoint(ro,rd,gl_FragColor);
	}
