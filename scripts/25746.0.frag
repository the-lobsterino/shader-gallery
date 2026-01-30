precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define STEPS 1280
#define FAR 10.0
#define EPS 0.02

float map(vec3 p) {
	float v = 2.+ 11.*length(p.xy+2e-1/p.z) + time/3.;
	float r = 1.35 + 0.15 * cos(50.0 * p.y + v) + 0.15 * cos(50.0 * p.x + v);
	return length(p) - r;
}

vec3 grad(vec3 p) {
	vec2 q = vec2(0.0, 0.1 * EPS);
	return vec3( map(p + q.yxx) - map(p - q.yxx),
		     map(p + q.xyx) - map(p - q.xyx),
		     map(p + q.xxy) - map(p - q.xxy) );
}

vec3 shade(vec3 ro, vec3 rd, float t) {
	vec3 n = normalize( grad(ro + t * rd) );
	return vec3(2.,0.09,0.1) * pow(1.0 - dot(-rd, n), 3.0);
}


void main( void ) {

	vec2 uv = 1.0 + -2.0 * (gl_FragCoord.xy / resolution) ;
	uv.x *= resolution.x / resolution.y;
	vec3 ro = vec3(0.0, 0.0, 2.5);
	vec3 rd = normalize( vec3(uv, -1.0) );
	
	float t = 0.0;
	float d = EPS; 
	
	for( int i = 0; i < STEPS; i++ ) {
		d = map(ro + t * rd);
		if (d < EPS || d > FAR) break;
		t += d;
	}
	
	vec3 col = d < EPS ? shade(ro,rd,t): mix( vec3(0.0), vec3(.3,.7,.4), 2.3 - length(uv) );
	col = pow( col, vec3(0.45) );
	
	gl_FragColor = vec4(col, 1.0);

}