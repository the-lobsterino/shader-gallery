#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float scene(vec3 p, float time) {
	float coobs = .6; 
	coobs = min(length(max(abs((p+vec3(-2+0*2,0.,2.)))-1.,0.)),coobs);
	return min(coobs,-p.z);	
}


vec3 normal(vec3 p, float t){
	float d = 0.1;	
	float dx = scene(p + vec3(d, 0.0, 0.0), t) - scene(p + vec3(-d, 0.0, 0.0), t);
	float dy = scene(p + vec3(0.0, d, 0.0), t) - scene(p + vec3(0.0, -d, 0.0), t);
	float dz = scene(p + vec3(0.0, 0.0, d), t) - scene(p + vec3(0.0, 0.0, -d), t);
	return normalize(vec3(dx, dy, dz));
}

vec4 render(float t) {
	vec3 pos = vec3(0,0,-7);
	vec3 dir = normalize(vec3((gl_FragCoord.xy - resolution.xy * .5) / resolution.x, .5));

	// Someone explain this part ? Please	
	
	float what = 0.;
	for(int i = 0; i < 24; i++) {
		float dist = scene(pos, t);
		pos += dist*dir;
		what += dist;
	}

	vec3 nrm = normal(pos, t);
	return vec4(vec3(0.0,1.,0.)/what*(2.+nrm.y), 1.);
}


void main(void) {
	gl_FragColor = render(time);
}