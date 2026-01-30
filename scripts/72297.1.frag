#define MARCH_STEPS 50
#define SURF_DIST 0.01
#define MAX_DIST 10.


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

struct ray {
	vec3 o, d;
};

float getDist(vec3 p){

	vec4 sph = vec4(0,0,2,1);
	float pla = -0.5;
	
	float d;
	float dsph=p.y-pla;
	float dpla=length(p - sph.xyz) - sph.a;
	   
	d = min(dsph,dpla);
	return d;
}

vec3 getNorm (vec3 p) {
	
	vec2 e = vec2(0.01, 0.);
	float d = getDist(p);
		vec3 n = d - vec3(
		getDist(p-e.xyy),
	        getDist(p-e.yxy),
		getDist(p-e.yyx)
		);
	return normalize(n);			
}

float march( ray r ) {
	float d=0.;
	for (int i=0; i<MARCH_STEPS; i++) {
		vec3 p = r.o + d*r.d;
		float ds = getDist(p);
	        d += ds;
		if ( ds < SURF_DIST || d > MAX_DIST ) break;
	}
	return d;
}		
	
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float t = time * 0.44;     
	vec3 cam = vec3( (cos(t) * 3.),0, (sin(t) * 3.));
	vec3 target = vec3(0, 0, 0);
	
	
	vec2 uv = ( gl_FragCoord.xy-.5*resolution.xy) / resolution.y  ;

	ray r; r.o=cam; r.d=normalize(vec3(uv,1));
	float depth = march(r);
	vec3 p = r.o + (r.d * depth);
	float color = depth / 4.;
	
	gl_FragColor = vec4( getNorm(p) + 1./vec3( color, color, color), 1);

}