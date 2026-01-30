#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// created by UMU(@umu____)
// if you know a better way to implement this code,please tell me.
// if you want to know how it works,please tell me.

float perlin(vec3 p) {
	float pi = 3.141592;
	vec3 i = floor(p);
	vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
	vec3 f = cos((p-i)*pi)*(-.5)+.5;
	a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
	a.xy = mix(a.xz, a.yw, f.y);
	return mix(a.x, a.y, f.z);
}

mat2 getRot2(float theta){
	return mat2(cos(theta), -sin(theta), sin(theta), cos(theta));
}

float getHeight(vec3 p){
	float res = 0.;
	float dis = length(p.xz);

	res += perlin(vec3(p.xz*0.7,0.)) /2.;
	res += perlin(vec3(p.xz*getRot2(0.5)*0.7,0.)) /2.;
	res += 1.5*perlin(vec3(p.xz*getRot2(0.3)*0.1,2.));
	res += 3.*perlin(vec3(p.xz*getRot2(0.44)*0.02,3.));
	
	res = max(-1.7,res);

	return p.y-res;
}

float getHeightP(vec3 p){
	float resP = 0.;
	
	float res = 0.;
	float dis = length(p.xz);
	
	res += perlin(vec3(p.xz*0.7,0.)) /2.;
	res += perlin(vec3(p.xz*getRot2(0.5)*0.7,0.)) /2.;
	res += 1.5*perlin(vec3(p.xz*getRot2(0.3)*0.1,2.));
	res += 3.*perlin(vec3(p.xz*getRot2(0.44)*0.02,3.));

	res = max(-1.7,res);
	
	if (res > -1.7){
		resP += 0.05*perlin(vec3(p.xz*3.,0.));
		resP += 0.1*perlin(vec3(p.xz*2.,0.));
	}

	return p.y-(resP+res);
}


vec3 getGrad(vec3 p){
	float h = 0.03;
	float ph = getHeightP(p);
	float phx = getHeightP(p+vec3(h,0.,0.));
	float phz = getHeightP(p+vec3(0.,0.,h));
	return normalize(vec3(phx-ph,h,phz-ph));
}

vec3 getColor(vec3 p,vec3 n,vec3 l,vec3 d){
	float cx = floor(mod(p.x,2.));
	float cy = floor(mod(p.y,2.));
	float cz = floor(mod(p.z,2.));	
	float dis = length(p.xz);
	float c = abs(sin(dis));
	vec3 cxyz = vec3(p.y,1.,p.y) + (perlin(p*1.5)+1.)/2.;
	float difs = pow(dot(n,l),3.) * 0.8;
	if (p.y > -1.5){
		return vec3(difs*cxyz);
	}else{
		return vec3(dot(reflect(-d,n),-l));
	}
}


void main( void ) {
	
	float stim = time*0.5;

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2. -1.;
	uv.x *= resolution.x/resolution.y;
	
	vec3 epos = vec3(0.+stim*10.,21.+17.*sin(stim),-1.);
	vec3 edir = vec3(uv,1);
	edir.y -= length(uv) * 0.01; // heuristic effect (no physical-based)  
	edir = normalize(edir);
	edir.yz *= getRot2(0.8);
	edir.xz *= getRot2(stim*0.51);
	
	
	vec3 p;
	float l = 0.0;
	float cosdir = dot(edir,vec3(0.,-1.,0.));
	float sindir = sqrt(1.-cosdir*cosdir);
	float sinalp = 0.8;
	float h;
	
	for (int i=0;i<64;i++){
		p = epos + edir * l;
		h = getHeight(p);
		float nL = (h*sinalp)/(sindir+cosdir*sinalp);
		l += nL;
	}
	l +=getHeight(p)/sindir;
	
	vec3 n = getGrad(p);
	
	vec3 light = normalize(vec3(cos(stim*.4),2.,sin(stim*.4)));
	gl_FragColor = vec4(getColor(p,n,light,edir),1.);
	if (h>5.){
		gl_FragColor.xyz = vec3(0.8);
	}


}