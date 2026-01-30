// thank you 
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

 

#define EPS 0.001
#define INF (1.0/0.0)
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

int pat[10];	// pattern

float sdBox(vec3 p, vec3 b) {
	vec3 q = abs(p) - b;
	return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdSphere(vec3 p, float r) {
	return length(p) - r;
}

float map(vec3 p) {
	float d = INF;
	p.zx *= rot(time * 0.6);
	//p.zy *= rot(time * 0.2);
	p -= vec3(-10, -2.0, 0);

	for (int j = 0; j < 5; j++) {
		int mask = 0x80000;
		for (int i = 0; i < 20; i++) {
			if (mod(float(pat[j] / mask), 2.0) > 0.0) {
				vec3 q = p - vec3(i, -j, 0);
 
				d = min(d, sdSphere(q-vec3(2.5*sin(time*3.),.0,0.0), 0.5));
			}
			mask /= 2;
		}
	}
	
	p -= vec3(0, 12.0, 0);
	
		for (int j = 5; j < 10; j++) {
		int mask = 0x80000;
		for (int i = 0; i < 20; i++) {
			if (mod(float(pat[j] / mask), 2.0) > 0.0) {
				vec3 q = p - vec3(i, -j, 0);
				d = min(d, sdBox(q, vec3(0.5,0.5,0.4)));
			 
			}
			mask /= 2;
		}
	}
	
	
	
	
	
	return d;
}

void main( void ) {
	vec3 rd = normalize(vec3(gl_FragCoord.xy/resolution.xy-0.5, 1));
	vec3 ro = vec3(0, 0, -25);
	vec3 color = vec3(0);
	float dist = 0.0;
	// pattern 
	// 
	// 4 = 1 0 0 ; 5 = 1 0 1 ; 7 = 1 1 1  .....etc   

	pat[0] = 0x57746;  
	pat[1] = 0x55545;
	pat[2] = 0x55645;
	pat[3] = 0x75545;
	pat[4] = 0x57576;  
	
	pat[5] = 0x57447;  
	pat[6] = 0x54445;
	pat[7] = 0x77445;
	pat[8] = 0x54445;
	pat[9] = 0x57777;   

	for (int i = 0; i < 64; i++) {
		vec3 p = ro + rd * dist;
		float d = map(p);
		if (d < EPS) {
			color = vec3(0,0.6,1) * 5.0 / float(i);
			break;
		}
		dist += d;
		if (dist > 50.0) {
			break;
		}
	}
	gl_FragColor = vec4(color.r*rd.y*3.0+0.5*sin(time)-0.5,color.g*0.95,color.b, 1) ;
}
