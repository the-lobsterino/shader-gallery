#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	return length(p) - 0.5;	
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	
	vec3 ro = vec3(0.0, 0.0, 3.0);
	vec3 rd = normalize(vec3(p.x, p.y, -3.0));
	
	float e = 0.0001;
	float h = e * 2.0;
	float t = 0.0;
	for(int i = 0; i < 60; i++) {
		if(abs(h) < e || t > 20.0) continue;
		h = map(ro + rd * t);
		t += h;
	}
	
	vec3 pos = ro + rd * t;
	vec3 nor = normalize(vec3(pos - vec3(0.0, 0.0, 0.0)));
	float color = pos.z;
	if(t > 20.0) color = 0.0;
	
	gl_FragColor = vec4( nor, 1.0);
}