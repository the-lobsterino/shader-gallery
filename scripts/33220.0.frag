#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 pos) {
	pos = mod(pos, 4.) - 2.;
	return length(pos) - 1.;	
}

float ray(vec3 pos, vec3 dir) {
	for(int i=0 ; i<40 ; i++) {
		float d = sphere(pos);
		if(d < .01) return 1. - float(i) / 40.;
		pos += dir * d + vec3(sin(time), 0., 0.) * d * d;
	}
	return 0.;	
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy * 2. - 1.;
	uv.x *= resolution.x / resolution.y;
	vec3 up = vec3(0, 0, 1);
	vec3 target = vec3(0, 0, 0);
	vec3 pos = vec3(time, 0, 0);
	vec3 forward = normalize(vec3(1, 0, 0));
	vec3 left = normalize(cross(forward, up));
	up = normalize(cross(left, forward));
	vec3 dir = normalize(forward + left * uv.x + up * uv.y);
	float b = ray(pos, dir);
	vec3 col = vec3(b);
	gl_FragColor = vec4(col, 1.);
}