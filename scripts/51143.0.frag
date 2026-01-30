#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MIN_DIST .001
#define MAX_DIST 100.
#define MAX_STEPS 100



float GetDist(vec3 p) {
	vec4 sphere = vec4(0, 1, 6, 1);
	float dS = length(p - sphere.xyz) - sphere.w;
	float dP = p.y;
	float d = min(dS, dP);
	return d;
}

vec3 GetNormal(vec3 p) {
	vec2 e = vec2(.01, 0);
	float d = GetDist(p);
	vec3 n = vec3(
		d - GetDist(p - e.xyy),
		d - GetDist(p - e.yxy),
		d - GetDist(p - e.yyx)
	);
	return (normalize(n));
}

float RayMarch(vec3 ro, vec3 rd) {
	float d0 = 0.0;
	for (int i = 0; i < MAX_STEPS; i++) {
		vec3 p = ro + d0 * rd;
		float dS = GetDist(p);
		d0 += dS;
		if (dS < MIN_DIST || d0 > MAX_DIST)
			break;
	}
	return d0;
}

float GetLight(vec3 p) {
	vec3 lightPos = vec3(0, 5, 6);
	lightPos.xy += vec2(sin(2. * time), cos(2. * time)) * 2.;
	
	vec3 l = normalize(lightPos - p);
	vec3 n = GetNormal(p);
	
	float dif = clamp(dot(n, l), 0., 1.);
	float d = RayMarch(p + n * MIN_DIST, l);
	if (d < length(lightPos - p)) dif *= .1;
	return dif;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
	
	vec3 col = vec3(40);
	
	vec3 ro = vec3(0, 1, 0);
	vec3 rd = normalize(vec3(uv.x, uv.y, 1));
	
	float d = RayMarch(ro, rd);
	
	vec3 p = ro + rd * d;
	
	float dif = GetLight(p);
	col = vec3(dif);
	
	gl_FragColor = vec4( col, 1.0 );

}