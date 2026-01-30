#ifdef GL_ES
precision mediump float;
#endif

// dashxdr 20200713
// dodecahedron
// Inspired by MagicTile

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
uniform sampler2D backBuffer;

#define MAX_STEPS 100
#define MAX_DIST  100.
#define SURF_DIST .01


#define X .525731112119133606
#define Z .850650808352039932

mat2 rot(float angle) {
	float s = sin(angle);
	float c = cos(angle);
	return mat2(c, s, -s, c);
}

vec3 findColor(int n) {
	if(n==0) return vec3(1., .5, 1./32.);
	if(n==1) return vec3(0xff, 0x69, 0xb2)/255.;
//	if(n==2) return vec3(0xcb, 0x15, 0x82)/255.;
	if(n==2) return vec3(0x69, 0x59, 0xc7)/255.;
	if(n==3) return vec3(.75);
	if(n==4) return vec3(0, 0xfa, 0x9c)/255.;
	if(n==5) return vec3(0.5, 0, 0);
	float t = float(n-5);
	return vec3(mod(t, 2.),mod(floor(t*.5), 2.),mod(floor(t*.25), 2.));
}

vec3 getVert(int n) {
	vec2 t12 = mod(vec2(n), vec2(2,4));
	float t4 = floor(float(n)/4.);
	vec3 o = vec3(X, 0, Z);
	if(t12.x==1.) o.x=-o.x;
	if(t12.y>=2.) o.z=-o.z;
	if(t4==0.) return o.yzx;
	if(t4==1.) return o.zxy;
	return o;
}
vec4 sphere = vec4(0, 1, 6, 1.5);
vec3 sphereColor(vec3 p) {
	vec2 angles = -(mouse-.5)*8.;
	p.yz = rot(angles.y)*p.yz;
	p.xz = rot(angles.x)*p.xz;
	vec3 p1;
	vec3 p2;
	vec3 p3;
	int bc;
	float best1d = -99.;
	float best2d = best1d;
	float best3d = best1d;
	for(int i=0;i<12;++i) {
		vec3 v = getVert(i);
		float d = dot(v, p);
		if(d>best1d) {
			best3d = best2d;
			p3 = p2;
			best2d = best1d;
			p2 = p1;
			best1d = d;
			p1 = v;
			bc = i;
		} else if(d>best2d) {
			best3d = best2d;
			p3 = p2;
			best2d = d;
			p2 = v;
		} else if(d>best3d) {
			best3d = d;
			p3 = v;
		}
	}
	vec3 mid12 = normalize(p1+p2);
	vec3 mid23 = normalize(p1+p3);
	vec3 dir = normalize(p1-p2);
	float b = dot(dir, p);
	b = smoothstep(.025, .03, b);
#define H 2.//exp(-fract(time/10.0))
#define R1 0.9351
#define T1 .0000
#define T2 .05
	//+H*mouse.x*R1)
	b*= smoothstep(T1, T2, abs(dot(p, mid12)-R1));
	b*= smoothstep(T1, T2, abs(dot(p, mid23)-R1));
	return b*findColor(bc);
}
#define PLANE  0.
#define SPHERE 1.

vec3 getColor(vec3 p, vec2 d) {
	if(d.y==SPHERE)
		return sphereColor(normalize(p-sphere.xyz));
	else if(d.y==PLANE)
		return vec3(1);
	return vec3(0,0,1);
}

vec2 GetDist(vec3 p) {
	float sphereDist = length(p-sphere.xyz)-sphere.w;
//	float planeDist = p.y;
//	if(sphereDist<planeDist)
		return vec2(sphereDist, SPHERE);
//	else
//		return vec2(planeDist, PLANE);
}
vec2 RayMarch(vec3 ro, vec3 rd) {
	float d=0.;
	vec2 dist;
	vec3 p;
	for(int i=0; i<MAX_STEPS; i++) {
		p = ro + rd*d;
		dist = GetDist(p);
		d += dist.x;
		if(d<0. || d>MAX_DIST || dist.x<SURF_DIST) break;
	}
	return vec2(d, dist.y);
}

vec3 GetNormal(vec3 p) {
	float d = GetDist(p).x;
	vec2 e = vec2(.01, 0);
	
	vec3 n = d - vec3(
		GetDist(p-e.xyy).x,
		GetDist(p-e.yxy).x,
		GetDist(p-e.yyx).x);
	
	return normalize(n);
}

vec2 GetLight(vec3 p, vec3 rd) {
	vec3 lightPos = vec3(1, 3, 3);
//	lightPos.xz += vec2(sin(time), cos(time))*2.;
	vec3 l = normalize(lightPos-p);
	vec3 n = GetNormal(p);

	vec3 mid = normalize(-rd + l);
	float specular = pow(max(0., dot(n, mid)), 64.);
	float dif = clamp(.5*dot(n, l)+.5, 0., 1.);
//dif = 1.;
//	float d = RayMarch(p+n*SURF_DIST*2., l).x;
//	if(d<length(lightPos-p)) dif *= .5;
	
	return vec2(dif, specular);
}



void main( void ) {
	vec2 uv = surfacePosition;//(gl_FragCoord.xy - .5*resolution) / resolution.x;

	vec3 ro = vec3(0, 1, 0);
	vec3 rd = normalize(vec3(uv.x, uv.y, 1));

	vec2 d = RayMarch(ro, rd);
	
	vec3 p = ro + rd * d.x;
	vec3 col;
	vec2 light = fract(d.xy/dot(rd,rd*(1.0-rd)));
	if(d.x>MAX_DIST)
		col = vec3(1,1,1);
	else {
		col = getColor(p, d);
		light = GetLight(p, rd);
		col *= vec3(light.x);
		col = mix(col, vec3(1), light.y*.7);
	}
	gl_FragColor = vec4(light.xy,0.0,1.0);//col, 1.0);
}
