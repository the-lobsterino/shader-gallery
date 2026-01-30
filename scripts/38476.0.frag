#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// created by UMU(@umu____)

float perlin(vec3 p) {
	float pi = 3.141592;
	vec3 i = floor(p);
	vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
	vec3 f = cos((p-i)*pi)*(-.5)+.5;
	a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
	a.xy = mix(a.xz, a.yw, f.y);
	return mix(a.x, a.y, f.z);
}

float getHeight(vec3 p){
	//perlin
	float dis = length(p.xz);
	return p.y - 1.*sin(p.x)*sin(p.z)*1. ;
	//return p.y - perlin(vec3(p.xz*0.7,0.));
}

vec3 getGrad(vec3 p){
	float h = 0.01;
	float ph = getHeight(p);
	float phx = getHeight(p+vec3(h,0.,0.));
	float phz = getHeight(p+vec3(0.,0.,h));
	return normalize(vec3(phx-ph,h,phz-ph));
}

vec3 getColor(vec3 p,vec3 n,vec3 l){
	float cx = floor(mod(p.x,2.));
	float cy = floor(mod(p.y,2.));
	float cz = floor(mod(p.z,2.));	
	float dis = length(p.xz);
	float c = abs(sin(dis));
	vec3 cxyz = vec3(p.y,1.-p.y,1.);
	float difs = pow(dot(n,l),2.);
	return vec3(difs*cxyz);
}

mat2 getRot2(float theta){
	return mat2(cos(theta), -sin(theta), sin(theta), cos(theta));
}

void main( void ) {
	
	float stim = time*0.5;

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2. -1.;
	uv.x *= resolution.x/resolution.y;
	
	vec3 epos = vec3(0.,36.+25.*sin(stim),-1.);
	vec3 edir = vec3(uv,1);
	edir.y -= length(uv) * 0.1; // heuristic effect (no physical-based)  
	edir = normalize(edir);
	edir.yz *= getRot2(1.2);
	edir.xz *= getRot2(stim*0.);
	
	
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
	
	vec3 n = getGrad(p);
	
	vec3 light = normalize(vec3(cos(stim*.4),2.,sin(stim*.4)));
	gl_FragColor = vec4(getColor(p,n,light),1.);
	if (h>0.1){
		gl_FragColor.xyz = vec3(0.8);
	}


}