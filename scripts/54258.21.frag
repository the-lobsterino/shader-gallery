#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;


mat2 rot(float a) {
	float s = sin(a);
	float c = cos(a);
	
	return mat2(c, s, -s, c);
}

float rand2(vec3 co)
{
    highp float a = 12.9898;
    highp float b = 78.2353;
    highp float c = 43758.5453;
    highp float p = 3020.2932277;
    highp float dt= dot(co.xyz ,(vec3(a,b,p)));
    highp float dt2= mod(dot(
					1./(max(
						fract(abs(co.yzx)),0.0000001 ) ),
					(vec3(a,b,p))
    			),a);
    return fract(fract(dt+dt2) * c);
}

float sIntersect(vec3 r0, vec3 rd, vec3 s0, float sr) {
    // - r0: ray origin
    // - rd: normalized ray direction
    // - s0: sphere center
    // - sr: sphere radius
    // - Returns distance from r0 to first intersecion with sphere,
    //   or -1.0 if no intersection.
	vec3 s00 = s0-r0;
	float f1= dot(rd,s00);
	vec3 inside=rd*f1-s00;
	
	
	float inner_d=dot(inside,inside);
	float backtrack=sqrt(sr*sr-inner_d);
	if(inner_d>sr*sr) return -1.;
	return f1-sign(f1)*backtrack;
}

float lzIntersect(vec3 r0, vec3 rd, inout vec3 s0, float sr){
	s0 = s0-r0;
	s0.z=max(min(rd.z/length(rd.xy)*length(s0.xy),s0.z+0.2),s0.z-0.2);
	return sIntersect(vec3(0.),rd,s0,sr);
	
}

void smod(in vec3 origin, in vec3 rd, in float sr, inout float ff, inout float sph_hash, inout vec3 sph, vec3 vv, inout float fill){
	vv+=0.5;
	vv=floor(vv);
	float h=rand2(vv)*234.0;
	vv+=0.5;
	float t=mod(time,2000.);
	vec3 tmod=vec3(sin(t+h),
		       sin(t+h*17.),
		       sin(t+h*3.1417))*0.09;
	vec3 mv=vv+tmod;
	float f=lzIntersect(origin,rd,mv,sr);
	//if(mod(h,5.)>1.) f=-1.;
	float ss=step(0.5,f)*fill;
	ff+=ss*f;
	sph_hash+=ss*h;
	sph+=ss*(mv);
	fill*=(1.0-ss);

}
float siu(in vec3 origin,in vec3 rd, in float sr, inout float sph_hash,inout vec3 sph){
	float ff=0.;
	float fill=1.0;
	if(rd.z<=0.) return -1.;
	if(rd.x==0.) return -1.;
	if(rd.y==0.) return -1.;
	float to_plane=2.0/rd.z;
	vec3 rda=abs(rd);
	for(float i=0.; i<4.1;i++){
		vec3 vv=rd*(to_plane+0.01);
		smod(origin, rd, sr, ff,sph_hash,sph,floor(vv),fill);

		vec3 cell=floor(rda*(to_plane)+1.000001);
		vec3 to_incr = ((cell)) / rda;	
		to_plane=min(to_incr.x,min(to_incr.y, to_incr.z));
	}
	
	return ff;
	
}

void main( void ) {

	vec2 uv =  (gl_FragCoord.xy -.5 * resolution.xy) / resolution.y ;
	vec3 ray = vec3(0.0,0.0,1.0);//normalize(vec3(uv.xy*0.875, 1));
	ray.xz*=rot(uv.x);
	ray.yz*=rot(uv.y+1.1);
	ray.xy*=rot(1.0);
	
	float t=time*0.0;
	vec3 lightDir = normalize(vec3(sin(t),cos(t),-1.));
	//vec3 lightDir = normalize(vec3(-0.5,1,-.6));

	vec4 color = vec4(.5);
	float z=0.0; 
	float ii = -4.; 
	float j = -2.;  
	const float a = .0;
	float sphr = 0.134;
	vec3 sph=vec3(0.);
	float sph_hash=0.;
	float fint=siu(vec3(0.),ray,sphr,sph_hash,sph);
	vec3 rayn=normalize(ray);
	bool alert=false;
	if (fint>0.) {
		float hash=sph_hash;//rand2(sph_hash.yzx+rand2(sph_hash.xyz*0.33333)*6.777)*3.1417*16.;
		vec3 inter = rayn*fint;
		vec3 normal = normalize(inter-sph.xyz );
		if(length(inter-sph.xyz)>sphr+0.1) alert=true;
		vec3 n=normal;
		float light = clamp(dot(normal,lightDir),0.15,1.);
			
		//normal.xy*=rot(hash*6.78+time*0.2);
		//normal.yz*=rot(hash*78.+time*0.1);
		//normal.zx*=rot(hash*11.);
			
		normal=normalize(normal)+2.0;
		normal*=0.333;
		float pi=3.141*2.;
		vec3 cmod=vec3(sin(hash)*0.5+0.5,sin(hash+pi/3.)*0.5+0.5, sin(hash+pi/3.*2.)*0.5+0.5);
			
		color = vec4(cmod,1.)*(vec4(light));
	}
	
	gl_FragColor = color;
	if(alert) gl_FragColor.rbg += vec3(rand2(vec3(gl_FragCoord.xyz+time)),rand2(vec3(gl_FragCoord.zyx+time)),rand2(vec3(gl_FragCoord.zyz+time)))*0.5;
}