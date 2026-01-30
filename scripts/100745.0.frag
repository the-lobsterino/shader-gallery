#extension GL_OES_standard_derivatives : enable
#define MAX_S 100
#define MAX_D 100.
#define SURFACE_D 0.001

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float getDist(vec3 p){
	float dPlane = p.y-0.2;
	vec4 sphere = vec4(0, 1, 6, 1);
	float dSphere = length(p-sphere.xyz)-sphere.w;
	float d = min(dSphere,dPlane);
	return d;
}

float rayMarch(vec3 ro, vec3 rd){
	float dO = 0.;
	for(int i = 0; i < MAX_S; i++){
		vec3 p = ro+dO*rd;
		float dS = getDist(p);
		dO += dS;
		if(dS<SURFACE_D || dO>MAX_D) break;
	}
	return dO;
}

vec3 GetNormal(vec3 p){
	float d = getDist(p);
	vec2 e = vec2(.01, 0.);
	vec3 n = d - vec3( 
		getDist(p-e.xyy), 
		getDist(p-e.yxy), 
		getDist(p-e.yyx) );
	return normalize(n);
}

float GetLight(vec3 p) {
	vec3 lightP = vec3(0., 5., 6.);
	vec3 lightN = normalize(lightP-p);
	vec3 N = GetNormal(p);
	
	float Diff = dot(N, vec3(1.));
	return Diff;
}

void main( void ) {

	vec2 p = (-resolution.xy + 2.0*gl_FragCoord.xy)/resolution.y;

	vec3 cp = vec3(0.,1.,0.);
	vec3 rd = normalize(vec3(p.x,p.y,1.));
	
	float d = rayMarch(cp,rd);
	
	vec3 l = cp + rd * d;
	
	float diffuse = GetLight(l);
	
	vec3 color = vec3(diffuse);

	gl_FragColor = vec4( color , 1.0 );

}