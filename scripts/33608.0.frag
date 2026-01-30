#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	vec2 uv = surfacePosition*3.;
	vec3 orb = vec3(100.0);
	for(int i = 0; i < 13; i++) {
		uv = abs(uv);
		uv = uv/dot(uv, uv) - vec2(0.4);
		orb.x = min(orb.x, length(uv));
		orb.y = min(orb.y, uv.x);
		orb.z = min(orb.z, uv.y);
	}
	
	vec3 col = mix(vec3(0), vec3(0.3, 0.4, 1.3), 1.0 - orb.x);
	col = mix(col, vec3(4.3, 0.0, 0.0), 3.0*orb.y + 1.5*orb.z);
	
	gl_FragColor = vec4(col, 1.0);
}