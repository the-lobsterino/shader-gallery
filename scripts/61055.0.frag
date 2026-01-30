#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate(float a) {
	return mat2(cos(a), sin(a), -sin(a), cos(a));
}

void main( void ) {

	vec2 u = (2. * gl_FragCoord.xy - resolution.xy) / resolution.y;
	vec3 col = vec3(0);
	
	float s = .5;
	for (int i = 0; i < 4; i++) {
		u = abs(u) / dot(u, u) - s;
		u *= rotate(time);
		s *= .888;
	}
	
	u = fract(u + .5) - .5;
	col += smoothstep(.04, .01, min(abs(u.x), abs(u.y)));
		
	
	gl_FragColor = vec4(col, 1);

}