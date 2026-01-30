// Art Deco Rose 
#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse, resolution;
#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))
#define PI2 6.2832
vec2 pmod(vec2 p, float n) {
	return vec2( length(p)*sin(mod(atan(p.y, p.x), PI2/n) - PI2/n/2.), length(p) );
}

float map(vec3 p) {
	p.xz *= rot(mouse.x*.66-.33);
	p.yz *= rot(mouse.y/2.-.25);
	p.xy = pmod(length(p.xy)<11.1?p.xy:p.xz, 18.0); p.y-=3.6;
	p.yz = pmod(p.yz, 1.4 + min(.6, sin(time/2.)+1. )); p.z-=10.;	// sin(time/2.)+1.  ->   time/4.		
	vec2 p1 = p.xy = pmod(p.xy, 14.); p.y-=4.;
	p.yz = pmod(p.yz,  .5); p.z-=10.2;			
	p.xy = pmod(p1,   10.); p.y-=2.3;	
	p.yz = pmod(p.yz, 12.); p.z-=9.8;			
	p.xy = pmod(p.xy, 10.); p.y-=2.3;
	p.yz = pmod(p.yz, 12.); p.z-=10.1;			
	return dot(abs(p), normalize(vec3(21,3,4))) - .77;  
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy -.5*resolution) /resolution.y;
	vec3 rd = normalize(vec3(uv, .75+clamp(2.*sin(mod(time/3.,PI2)),-.5,.25))), p = vec3(0,0,-15);
	gl_FragColor = vec4(0);
	
	for (int i=1; i<110; i++) {
		float d = map(p);
		if (d < .001) {
			gl_FragColor = vec4(100.*pow(float(i),-1.5),0,0,1);	
			if (length(p.xy)>9.9) gl_FragColor.r=1.-gl_FragColor.r*2.5;
			else gl_FragColor.r*=2.;
			break;
		}
		p += rd * d;
	}
}