precision highp float;

#define MAX_VIEW_DIST 20.

// globals passed into us
uniform float time;
uniform vec2 resolution;

float t = time;

vec2 T(vec2 p,float q){				// 2D rotate
	return vec2(cos(q)*p.x+sin(q)*p.y,-sin(q)*p.x+cos(q)*p.y);
}

float Mystery(vec3 p){
	float d=1000.,q=-50.,r=t-53.;
	vec3 o=vec3(.92858,.92858,.32858);
	for(float i=0.;i<6.;i++){
		p.xy=T(p.xy,t/4.);
		p=abs(p);
		if(p.x<p.y)p.xy=p.yx;
		if(p.x<p.z)p.xz=p.zx;
		if(p.y<p.z)p.yz=p.zy;
		p=3.*p-o*2.;
		if(p.z<-o.p)p.z+=o.z*2.;
		d=min(d,length(p)*pow(3.,-i-1.));
	}
	return d-.001;
}

float Sphere(vec3 p, vec3 o, float r){
        float d=sin(5.*p.x)*sin(15.*p.y)*sin(5.*p.z);	// Get some cheap-ass noise value
	d*=cos(t/10.)/5.;				// Wom it with time
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
	d = min(d, Mystery(p - vec3(1.5,1.5,-1.)));
	p.xz = DR(p, vec3(2.)).xz;
	d = min(d, Sphere(p,vec3(0,sin(t)+1.,0),.3));
	return d;
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
	for (int i=0; i<36; i++) {
		float d=h(p);
		if (d<0.001)
			return float(i)/36.;
		p += q * d * .5;
	}
	
	return 1.;
}

void main(void) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	
	vec3 ro = vec3(1.4, 1.6, -4);			// Cam pos (ray origin)
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
		p += rd * d * .5;			// March along! NOTE SMALL STEP
	}
	
	float hitdist = length(p-ro);
	vec3 bg=vec3(uv.x / 2., uv.y * 1.4, 1);
	if (d < .01) {					// We hit something!
		vec3 lp = vec3(10,10,-10);		// Light position
		vec3 ld = normalize(lp-p);		// Light direction
		vec3 n = GetNormal(p); 			// Normal
		float diffuse = dot(n,ld);		// Diffuse amount
		vec3 c = vec3(.8,.9,1) * diffuse * AO(p,n) * SH(p,ld);
		
		c=mix(c,bg,clamp(hitdist/MAX_VIEW_DIST,0.,1.));	// Foggy
		
		gl_FragColor = vec4(c, 1);
	} else						// We fucking hit NOTHING
		gl_FragColor = vec4(bg, 1);
}