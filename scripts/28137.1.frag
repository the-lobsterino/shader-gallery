precision highp float;

// globals passed into us
uniform float time;
uniform vec2 resolution;

float t = time;

float Sphere(vec3 p, vec3 o, float r){
        return length(p-o)-r;  
}
 
float Plane(vec3 p){
	return p.y;	
}

vec3 DR(vec3 p,vec3 q){
	return mod(p,q)-q/2.;
}

float h(vec3 p) {
	float d = Plane(p);
	p.xz = DR(p, vec3(2.)).xz;
	return min(Sphere(p,vec3(0,sin(t)+1.,0),.3), d);
}

vec3 GetNormal(vec3 p) {
	vec2 e=vec2(.001,0);
	return normalize(vec3(
		h(p+e.xyy)-h(p-e.xyy),
		h(p+e.yxy)-h(p-e.yxy),
		h(p+e.yyx)-h(p-e.yyx)
	));
}

float AO(vec3 p,vec3 q){			// AO at point p with normal q
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

float SH(vec3 p, vec3 q){			// Calculate shadow amount: p=intersection point; q=light direction
	vec3 r = p + q*.01;
	float d;
	for(int i=0; i<16; i++) {
		d = h(r);
		if (d < .001)
			break;
		r += q * d;				// March along!
	}
	if (d < 0.001)
		return 0.1;
	else
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
	for(int i=0; i<128; i++) {
		d = h(p);
		if (d < .001)
			break;
		p += rd * d;				// March along!
	}
	
	if (d < .001) {					// We hit something!
		vec3 lp = vec3(10,10,-10);		// Light position
		vec3 ld = normalize(lp-p);		// Light direction
		vec3 n = GetNormal(p); 			// Normal
		float diffuse = dot(n,ld);		// Diffuse amount
		vec3 c = vec3(.8,.9,1) * diffuse * AO(p,n) * SH(p,ld);
		
		gl_FragColor = vec4(c, 1);
	} else						// We fucking hit NOTHING
		gl_FragColor = vec4(uv.x / 2., uv.y * 1.4, 1, 1);
}