#ifdef GL_ES
precision mediump float;
#endif

// xray by Jaksa

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 p, vec3 o, float r) {
	return distance(p,o) - r;
}

float map(vec3 p) {
	float d = sphere(p, vec3(0,0,6), 3.0);
	d = min(d, sphere(p, vec3(1.*sin(time),2,10), 3.0));
	return min(d, p.y + 30.);
}

vec3 grad(vec3 p) {
	vec2 d = vec2(0.01,0.0);
	
	return (map(p) - vec3(map(p + d.xyy), map(p + d.yxy), map(p+d.yyx)))/d.x;
}

void main( void ) {
	vec2 uv = 2.*gl_FragCoord.xy/resolution.xy-1.;
	vec3 cam = vec3(0,0,-1);
	vec3 p = vec3(uv, 0);	
	vec3 dir = normalize(p-cam);

	float delta = 0.001;
	float d = 0.0;
	float dist = 0.0;
	
	float volume = 0.0;
	float angle = 0.0;
	
	for (int i = 0; i < 128; i++) {
		d = map(p);
		volume += max(-clamp(d, -.01, .01), 0.0);
		dist += max(max(0.0, d), .1);
		if (dist > 100.) break;
		p = dir*dist;
	}
	
	angle = dot(dir, grad(p));
	float c = log(1.0 + volume)/(1.0 + log(1.0 + volume));
	
	gl_FragColor = vec4(vec3(c), 1.0 );

}