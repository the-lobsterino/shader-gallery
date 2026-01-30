#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// dashxdr 20200711
// Penrose tiling, experiment with inflation/deflation
// https://www.maa.org/sites/default/files/pdf/pubs/focus/Gardner_PenroseTilings1-1977.pdf
float cr(vec2 p, vec2 a, vec2 b) {
	a=normalize(a-b);
	b=p-b;
	return a.y*b.x - a.x*b.y;
}

float interiorDist(vec2 p, vec2 a, vec2 b, vec2 c) {
	if(cr(c,a,b)>0.) {
		vec2 t=a;
		a=c;
		c=t;
	}
	return max(cr(p,a,b), max(cr(p,b,c),cr(p,c,a)));
}

bool inside(vec2 p, vec2 a, vec2 b, vec2 c) {
	return interiorDist(p, a, b, c)<0.;
}


void main( void ) {
	vec2 pos = surfacePosition;

	float ba = 3.0776835371752527; // tan(72 degrees)
	float phi = 1.6180339887498948;
	float iphi = phi-1.;
	float s = .3;

	vec2 p1 = vec2(-s, -s*ba*.5);
	vec2 p2 = vec2(0., s*ba*.5);
	vec2 p3 = vec2(s, -s*ba*.5);
	vec2 p12, p23, p31;
	vec2 t;
	int type = 0; // 0=thin, 1=fat

	vec3 col = vec3(0,0,.2);
	vec3 a = vec3(1,0,0);
	vec3 b = vec3(1,.5,.2);
	const float iter = 20.;
	float maxIter = 1. + mouse.x*iter;
	for(float i=0.;i<iter;++i) {
		if(i>=maxIter) break;
		if(type==0) {
			p12 = mix(p2, p1, iphi);
			p23 = mix(p3, p2, iphi);
			if(inside(pos, p12, p2, p23)) {
				p1=p2;
				p2=p23;
				p3=p12;
				type = 1;
				col=b;
			} else if(inside(pos, p1, p12, p3)) {
				p2=p3;
				p3=p1;
				p1=p12;
				type=0;
				col=a;
			} else if(inside(pos, p12, p23, p3)) {
				p1=p12;
				p2=p3;
				p3=p23;
				type = 0;
				col=a;
			}
		} else {
			p31 = mix(p1, p3, iphi);
			if(inside(pos, p1, p2, p31)) {
				t = p2;
				p2 = p1;
				p3 = p31;
				p1=t;
				type = 0;
				col=a;
			} else if(inside(pos, p2, p3, p31)) {
				p1 = p3;
				p3 = p2;
				p2 = p31;
				type = 1;
				col=b;
			}
		}
	}
	float d = interiorDist(pos, p1, p2, p3);
	float m = max(length(p1-p2), max(length(p2-p3), length(p3-p1)));
	if(d<0. && -d<m*.03) col=vec3(0,0,0);
	float r1, r2;
	float m1 = m*iphi;
	if(type==0) {
		r1=length(pos-p2);
		r2=length(pos-p1);
	} else {
		r1=length(pos-p1);
		m1*=iphi;
		r2=length(pos-p2);
	}
	float m2 = m1*iphi;
	float thick = m*.02;
	float d1 = abs(r1-m1);
	float d2 = abs(r2-m2);
	if(min(d1,d2)<thick) {
		col = mix(col, d1<d2 ? vec3(1) : vec3(1,1,0), .75);
	}

	gl_FragColor = vec4(col, 1.);
}
