#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// Simo, 2017-01-31

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
int maxdepth = 4;

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec3 angleNoise(vec3 angle, float radius) {
	return normalize(vec3(angle.x + (rand(angle.xy) - 0.5) * radius / 180.0,
			      angle.y + (rand(angle.xy) - 0.5) * radius / 180.0,
			      angle.z + (rand(angle.xy) - 0.5) * radius / 180.0));
}

mat3 HitSphere(vec3 r, vec3 dir, float sp) {
	// sphere and radius
	float t = time*0.3;
	vec3 sphere = 
/*		1.0 * vec3(10.0*(rand(vec2(sp-1.0,sp)-0.5)),
			   15.0*(sin((rand(vec2(sp+1.0,sp)))-0.5)),
			   10.0*(rand(vec2(sp,sp+1.0))-0.5)-20.0);*/
		vec3(sin(t+sp*3.14/8.0)*6.0,
			   cos(t+sp*4.14/8.0)*6.0,
			   cos(t+sp*5.14/8.0)*6.0-10.0);
	float sr = (1.5 + sin(sp*26.1) * 0.8)*0.55;
	
	vec3 l = sphere - r;
	float tca = dot(l,dir);
	float d2 = dot(l,l)-tca*tca;
	float sr2 = sr * sr;
	if(d2>sr2) return mat3(0,0,0,0,0,0,0,0,0);
	float thc = sqrt(sr2-d2);
	float t0=tca-thc;
	float t1=tca+thc;
	/*if((t0<0.0 && t1>0.0) || (t0>0.0 && t1<0.0)) {
		return mat3(0,0,0,0,0,0,0,0,0);
	}*/
	if(t0>t1) {
		float tt = t0;
		t0 = t1;
		t1 = tt;
	}
	if(t0<0.0) {
		t0 = t1;
		if(t0<0.0) return mat3(0,0,0,0,0,0,0,0,0);
	}
	vec3 hit = r + dir * t0;
	vec3 norm = normalize(hit-sphere);
	return mat3(hit,norm,vec3(1,sp,1));
}

vec3 matColor(float sp) {
	float mrp = rand(vec2(sp,sp));
	return vec3(
		mrp*0.8+0.2,
		1.0-mrp,
		mrp*mrp);
}

mat3 FindNearestObject(vec3 r, vec3 dir, float skip) {
	// r = starting point
	// dir = direction vector
	
	// find nearest object and return the point as (x,y,z) and material as (w)
	float cdist = 10000.0;
	mat3 lhit = mat3(0,0,0,0,0,0,0,0,0);
	for(int i=0;i<32;i++) {
		if(abs(float(i)-float(skip))<0.1) {
			continue;
		}
		mat3 hitmat = HitSphere(r,dir,float(i));
		vec3 hit = hitmat[0];
		float dist = length(hit - r);
		if (dist<cdist) {
			cdist = dist;
			lhit = hitmat;
			lhit[2].z=dist;
		}
	}
	return lhit;
}


vec4 TracePath(vec3 r, vec3 dir) {
	// find nearest object from point r forward towards direction dir
	float n_last = -1.0;
	int total_rays = 1;
	mat3 budget[16];
	budget[0][0]=r;
	budget[0][1]=dir;
	budget[0][2]=vec3(1.0,6.0,-1.0);
	for(int iter = 0; iter < 16; iter++ ) {
		// at the end of our ray budget, finish gathering
		if(iter>total_rays) break;
		vec3 n_r = budget[iter][0];
		vec3 n_dir = budget[iter][1];
		n_last = budget[iter][2].z;

		mat3 hit = FindNearestObject(n_r,n_dir,n_last);
		if(hit[2].x<0.1) {
			budget[iter][2] = vec3(0);
			continue;
		}
		
		vec3 emit = matColor(hit[2].y+4.0);
		float reflectance = 0.2;
		float roughness = rand(vec2(hit[2].y))*0.3;
		float dist = hit[2].z;
		float brdf_budget = budget[iter][2].x;
		int rays = int(budget[iter][2].y * roughness / 0.3);
		// shoot subsequent rays
		for(int ray=0;ray<16;ray++) {
			if(ray<total_rays) continue;
			if(ray>=total_rays+rays) break;
			n_dir = angleNoise(hit[1], roughness * 180.0);
			n_r = hit[0];
			n_last = hit[2].y;
			float cos_theta = dot(n_dir, hit[1]);
			float brdf = 2.0 * reflectance * cos_theta;
			budget[ray][0] = n_r;
			budget[ray][1] = n_dir;
			budget[ray][2].x = brdf * brdf_budget / float(rays);
			budget[ray][2].y = float(rays)/2.0;
			budget[ray][2].z = n_last;
		}
		total_rays += rays;
		// render equation: emittance + (BRDF * reflected);
		budget[iter][2] = brdf_budget * emit;
	}
	vec4 ret = vec4(0.0);
	for(int i=0;i<16;i++) {
		if(i<total_rays)
			ret.xyz += budget[i][2];
		else
			break;
	}
	return ret;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )-vec2(0.5,0.5);
	float apx = 2.0;
	float apy = 2.0;
	float r = ((mouse.x-0.5)*6.281 + position.x * apx);
	vec3 lookat = normalize(vec3(cos(r),
				     position.y*apy+mouse.y-0.5,
				     sin(r)));
	vec4 color = TracePath(vec3(0,0,-20.0+sin(time*0.4)*3.0),lookat);

	gl_FragColor = vec4(color.xyz,1.0);

}