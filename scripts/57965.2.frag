
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rotate(a) mat2(cos(a + vec4(0, 33, 11, 0)))
void main() {

	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
		
	
	vec3 p = vec3(0);
	vec3 ro = vec3(sin(time * .1) * 1., cos(time * .1) * 2. - 1000., time * 8.);
	vec3 rd = vec3(uv, 1);
	
	rd.x = uv.x + sin(time) * .1;
	rd.y = uv.y + cos(time) * .1;
	rd = normalize(rd);

	float t = 0.;
	for (int i = 0; i < 64; i++) {
		p = ro + rd * t;
	
		float z = p.z;
		vec3 _p = p;
		p = mod(p, 4.) - 2.;
		
		t += .5 * max(min(min(min(length(p.xy) - .5 - .1 * cos(z * .5 + time), length(p.yz) - .5), length(p.xz) - .5), length(vec2(length(p.xy) - .5, mod(p.z, 2.) - 1.)) - .5), -(length(_p - ro) - 2.));
	}
			
	// little code to make fog
	float f = 1. - exp(-t * .05); // smooth transition and plateu from 0 - 1
	float s = max(dot(rd, vec3(0, .6, 0)), 0.); // is the camera (rd) looking at the light / sun 
	col = mix(col, mix(vec3(1, .5, 0), vec3(0, 1, 1), s), f); // mix the main color with the scene color based on fog amt
	
	
	//test 
	
	gl_FragColor = vec4(col, 2.);


}