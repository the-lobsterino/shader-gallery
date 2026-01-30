precision highp float;

#define MAX_VIEW_DIST 14.

// globals passed into us
uniform float time;
uniform vec2 resolution;

float t = time;

float Sphere(vec3 p, vec3 o, float r){
        float d=pow(cos(30.*p.x), 2.)*sin(30.*p.y)*cos(30.*p.z);	// Get some cheap-ass noise value
	//d*=sin(t/10.)/20.;				// Wom it with time
	d*=0.03;
	return length(p-o)-r+d;				// Just add it to the freakin distance XD
}
 
float Plane(vec3 p){
	float d=sin(p.x)/10.+sin(p.z)/10.;		// Again with cheap-ass "noise"
	return p.y+d;
}

vec3 DR(vec3 p,vec3 q){					// Domain repeat
	return mod(p,q)-q/2.;
}

float h(vec3 p) {					// Main distance func
	float d = Plane(p);
	p.xz = DR(p, vec3(2.)).xz;
	return min(Sphere(p,vec3(0,sin(t)+1.,0),.3), d);
}

vec3 GetNormal(vec3 p) {				// Get a normal up in this maw
	vec2 e=vec2(.001,0);
	return normalize(vec3(
		h(p+e.xyy)-h(p-e.xyy),
		h(p+e.yxy)-h(p-e.yxy),
		h(p+e.yyx)-h(p-e.yyx)
	));
}

float AO(vec3 p,vec3 q){				// Find AO coefficient at point p with normal q
	float o=0.,s=1.,r,d;
    	for(float i=0.;i<5.;i++){
		r=.01+.12*i/4.;
		vec3 a=q*r+p;
		d=h(a);
		o+=-(d-r)*s;
		s*=.95;
    	}
    	return clamp(1.-3.*o,0.,1.);   
}

float SH(vec3 p,vec3 q){				// Calculate shadow amount: p=intersection point; q=light direction
	p+=q*.01;
	for (int i=0; i<24; i++) {
		float d=h(p);
		if (d<0.001)
			return float(i)/24.;
		p += q*d;
	}
	
	return 1.;
}

void main(void) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	
	vec3 ro = vec3(1.4, cos(t)+1.4, t);			// Cam pos (ray origin)
	vec3 up = vec3(0, 1, 0);			// Cam orientation vecs
	vec3 fd = vec3(0, 0, 1);
	vec3 right = -cross(fd,up);
	
	float fov=1.8;
	vec3 rd = normalize(right*uv.x + up*uv.y + fd*fov);	// Ray dir 
	
	vec3 p = ro;					// Current test position
	float d;					// Distance of p from surface
	for(int i=0; i<256; i++) {
		d = h(p);
		if (d < .01)
			break;
		p += rd * d * .25;			// March along! NOTE SMALL STEP
	}
	
	float hitdist = length(p-ro);
	vec3 bg=vec3(uv.x / 2. * cos(t/0.61)+1.0, uv.y * 1.4 * sin(t/3.)+0.5, 1);
	if (d < .01) {					// We hit something!
		vec3 lp = vec3(10,10,-10.+t);		// Light position
		vec3 ld = normalize(lp-p);		// Light direction
		vec3 n = GetNormal(p); 			// Normal
		float diffuse = dot(n,ld);		// Diffuse amount
		vec3 c = vec3(sin(t)+1.*0.5,-sin(t)+1.*sin(p.z)+1.*0.5,cos(p.y)+1.0*0.5) * diffuse * AO(p,n) * SH(p,ld);
		
		c=mix(c,bg,pow(clamp(hitdist/MAX_VIEW_DIST,0.,1.), 1.6));	// Foggy
		
		gl_FragColor = vec4(c, 1);
	} else						// We fucking hit NOTHING
		gl_FragColor = vec4(bg, 1);
}