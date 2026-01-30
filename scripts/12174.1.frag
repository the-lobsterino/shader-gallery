#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 plane(vec3 ro, vec3 rd) {
	float i;
	vec3 v;
	float topD;
	for(int k = 0; k < 30; k++) {
		i++;
		vec3 pos = ro+rd*(i/3.0+10.0);
		if(abs(sin(pos.x+2484.429)+sin(pos.y+4920.2940)-cos(pos.z-42901.49021))<0.5) {
			v = pos;
			topD = float(k);
		}
	}
	return abs(sin(v/10.0))*(topD/50.0);
}
vec3 intersect(vec3 ro, vec3 rd) {
	return plane(ro, rd);
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec3 ro = vec3(0.0, time*4.0, 0.0);
	vec3 rd = normalize(vec3(2.0*uv-1.0, 1.0));
	
	gl_FragColor = vec4(0.0);
	gl_FragColor = vec4(intersect(ro, rd), 1.0);
}