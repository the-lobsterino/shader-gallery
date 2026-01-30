#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
	uv.x *= resolution.x/resolution.y;
	uv *= 0.6;
	vec2 ov = uv;
	float orb1 = 100.0;
	float orb2 = 100.0;
	for(int i = 0; i <3; i++) {
		uv = abs(uv)/dot(uv, uv) + vec2(-1.0 + sin(time*0.3));
		
		orb1 = min(orb1, sqrt(uv.x*uv.y));
		orb2 = min(orb2, uv.x*uv.x);
	}
	
	vec3 col = mix(vec3(1.0, 0.3, 0.6), vec3(0.0), orb1);
	col = mix(col, vec3(0.1, 0.0, 1.0), 0.5*orb2);
	
	gl_FragColor = vec4(col, 1.0);
}