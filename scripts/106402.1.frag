#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .01

float sdRoundBox( vec3 p, vec3 b, float r ){
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}


float GetDist(vec3 p) {
	float boxDist = sdRoundBox(p + vec3(0. + sin(time), -.5, 0), vec3(.3, .2, .2), .02);
	float planeDist = p.y;
	
	float d = min(boxDist, planeDist);
	
	return d;
}

float RayMarch(vec3 ro, vec3 rd) {
	float dO = 0.;
	
	for (int i = 0; i < MAX_STEPS; i ++) {
		vec3 p = ro + rd*dO;
		float dS = GetDist(p);
		
		dO += dS;
		
		if (dO > MAX_DIST || dS < SURF_DIST) break;
	}
	
	return dO;
}

vec3 GetNormal(vec3 p) {

	float d = GetDist(p);
	vec2 e = vec2(.01, 0.);
	
	vec3 n = d - vec3(
		GetDist(p - e.xyy),
		GetDist(p - e.yxy),
		GetDist(p - e.yyx)
	);

	return normalize(n);	
}


float GetLight(vec3 p ) {
	vec3 lightPos = vec3(12., 9., -4.);
	
	lightPos += vec3(sin(time) * 2., cos(time) * 2., lightPos.z);

	vec3 l = normalize(lightPos - p);
	
	vec3 n = GetNormal(p);
	
	float dif = clamp(dot(n, l), 0., 1.);
	float d = RayMarch(p + n * SURF_DIST * 18.1, l);
	
	if (d < length(lightPos - p)) dif *= .5;
	
	return dif;
}

void main( void ) {

	vec2 uv = (gl_FragCoord.xy - .5*resolution.xy) / resolution.y;
	
	vec3 col = vec3(0);
	
	vec3 ro = vec3(0., 1., -4.);
	vec3 rd = normalize(vec3(uv.x, uv.y, 0.75));
	
	float d = RayMarch(ro, rd);
	
	vec3 p = ro + rd * d;
	
	
	float dif = GetLight(p);
	
	col += vec3(dif);

	gl_FragColor = vec4( col, 1.0 );
}