#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


struct HitInfo {
	bool hit;
	float dist;
	vec4 col;
	vec3 p;
};

vec2 rotate2(vec2 v, float angle) {
	return v * vec2(cos(angle),sin(angle));
}


HitInfo scene(vec3 p) {
	HitInfo hi;
	hi.hit = false;
	hi.dist = 10.;
	hi.col = vec4(0);
	
	vec3 ori = vec3(0,0,-10);
	vec3 prel = p-ori;
	float r = length(prel);
	
	float d1 = r-(2.+sin(time));
	hi.dist = min(hi.dist, d1);
	if (d1 < 0.001) {
		float f = 10.0;
		hi.hit = true;
		hi.col = vec4(sin(p.x*f),sin(p.y*f),sin(p.z*f),1.0);
	}
	float d2 = length(p-vec3(0,-10000,0))-10000.0;
	hi.dist = min(hi.dist, d2);
	if (d2 < 0.001) {
		float f = 5.0;
		hi.hit = true;
		hi.col = vec4(sin(p.x*f),sin(p.y*f),sin(p.z*f),1.0);
	}
	
	float amount = 8.0;
	float paxy = sin(cos(r*2.0)+atan(prel.x,prel.y)*amount+time)+1.;
	float paxz = sin(sin(r*2.0)+atan(prel.x,prel.z)*amount)+1.;
	//float payz = sin(atan(fract(p.y/border),fract(p.z/border))*10.);
	vec2 v = vec2(paxy,paxz);
	float d3 = length(v);
	if (d3 < 0.1) {
		float f = 5.0;
		hi.hit = true;
		//hi.col.xyz = vec3(sin(paxy*10.),sin(paxz*10.),sin(payz*10.)) / 2.0;
		hi.col = vec4(sin(p.x*f),sin(p.y*f),sin(p.z*f),1.0);
		hi.col.w = 1.0;
	}
	return hi;
}

HitInfo rayMarchS(vec3 rp, vec3 rd) {
	HitInfo hi;
	hi.hit = false;
	hi.dist = 0.0;
	hi.col = vec4(0.0);
	for (int i=0; i<100; i++) {
		//rp += rd*hi.dist;
		rp += rd*0.1;
		hi = scene(rp);
		if (hi.hit) {
			hi.p = rp;
			break;
		}
	}
	return hi;
}

void main( void ) {

	vec2 p = surfacePosition;
	vec2 p2 = gl_FragCoord.xy/resolution * 2.0 - 1.01; // 0.01 more wtf
	//p2.x *= resolution.x/resolution.y;
	p2.y *= resolution.y/resolution.x;
	//calculate zoom factor (right mouse) >1.0 is zoomed in
	vec2 zoom2 = abs(p2)/abs(p); 
	float zoom = pow(max(zoom2.x,zoom2.y),1./90.);
	
	float saxy = atan(p.x,p.y);
	
	vec3 rp = vec3((mouse.x-0.5)*10.0, mouse.y*3.0, 0.0);//+vec3(cos(time),0,sin(time));
	vec3 rd = normalize(vec3(p,-2.0));
	//vec3 rd = vec3(p,-2.0);
	vec4 col = vec4(0.0);
	HitInfo hi = rayMarchS(rp,rd);
	col = hi.col;
		
	//col.r=zoom;
	//col.r=0.;
	//col.gb=abs(p);
	col.w = 1.0;
	gl_FragColor = col;
	
	//test pattern
	//gl_FragColor = vec4(vec3( sin(atan(fract(p.x/0.50),fract(p.y/0.50))*10.) ),1);
	//gl_FragColor = vec4(fract(p.x/0.25));
}