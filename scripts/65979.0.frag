#ifdef GL_ES
precision mediump float;
#endif

// dashxdr 20200707
// Using ray marcher from BigWings

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_STEPS 100
#define MAX_DIST  100.
#define SURF_DIST .01

float dScrew(vec3 p) {
	vec3 c = vec3(0, 0, 6);
	float r1 = .8; // inner radius (threaded part)
	float r2 = 1.; // outer radius
	float h = .5*mouse.y; // height of one revolution
	if(time<.1) h = .4;
	h = max(.0001, h);
	float h2 = .5*h;
	vec3 adir = p-c;
	float d=length(adir.xz);
	if(d<r1) return d-r1;
	float a = .15+atan(adir.z, adir.x)/6.283185307179586; // angle in range 0 to 1
a = fract(a+sin(time));
	float peak = adir.y - mod(adir.y, h) + a*h;
	if(adir.y>peak+h2) peak+=h;
	else if(adir.y<peak-h2) peak-=h;
	float dy = abs(adir.y-peak);
	float cd = length(vec2(d-r2, dy)); // distance to closest peak
	vec2 along = vec2(r2-r1, -h2);
	float len = length(along);
	along/=len;
	if(dot(vec2(d-r1, dy-h2), along) > len) return cd;
	vec2 n = vec2(-along.y, along.x);
	return dot(n, vec2(d-r2, dy));
}


float GetDist(vec3 p) {
//	vec4 s = vec4(0, 1+sin(time), 6, 1);
//	float sphereDist = length(p-s.xyz)-s.w;
	float planeDist = p.y;
	float screwDist = dScrew(p);

	float d = min(screwDist, planeDist);
//	d = max(sphereDist, d);

	return d;
}
float RayMarch(vec3 ro, vec3 rd) {
	float dO=0.;
	for(int i=0; i<MAX_STEPS; i++) {
		vec3 p = ro + rd*dO;
		float dS = GetDist(p);
		dO += dS;
		if(dO<0. || dO>MAX_DIST || dS<SURF_DIST) break;
	}
	return dO;
}

vec3 GetNormal(vec3 p) {
	float d = GetDist(p);
	vec2 e = vec2(.01, 0);
	
	vec3 n = d - vec3(
		GetDist(p-e.xyy),
		GetDist(p-e.yxy),
		GetDist(p-e.yyx));
	
	return normalize(n);
}

float GetLight(vec3 p) {
	vec3 lightPos = vec3(2, 5, 3);
	lightPos.xz += vec2(sin(time), cos(time))*2.;
	vec3 l = normalize(lightPos-p);
	vec3 n = GetNormal(p);
	
	float dif = clamp(dot(n, l), 0., 1.);
	float d = RayMarch(p+n*SURF_DIST*2., l);
	if(d<length(lightPos-p)) dif *= .1;
	
	return dif;
}


void main( void ) {
	vec2 uv = (gl_FragCoord.xy - .5*resolution) / resolution.x;

	vec3 col = vec3(.0);

	vec3 ro = vec3(0, 1, 0);
	vec3 rd = normalize(vec3(uv.x, uv.y, 1));

	float d = RayMarch(ro, rd);
	
	vec3 p = ro + rd * d;
	
	float dif = GetLight(p);
	col = vec3(dif);
	
	col = pow(col, vec3(.4545));	// gamma correction
	if(d>=MAX_DIST) col=vec3(0.2,0.2,.4);
	gl_FragColor = vec4(col, 1.0);
}

