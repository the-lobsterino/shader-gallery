#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float hash(vec2 uv) {
	return fract(74455.45 * sin(dot(vec2(78.54, 214.45), uv)));
}

vec2 hash2(vec2 uv) {
	float  k = hash(uv);
	return vec2(k, hash(uv + k));
}

void main( void ) {

	
	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec3 c = vec3(0.0);
	
	for (float i = 0.0; i < 40.0; i++) {
		vec2 p = 1.0 * hash2(i + vec2(22.0));
		p.x += 0.1 * sin(time * hash(i + vec2(22.0)));
		p.y += 0.1 * cos(time * hash(i + vec2(26.0)));
		c += smoothstep(0.05, 0.0049, distance(p, uv)) * vec3(1.0, 0.3, 0.4);
	}
	
	
	c = mix(c, texture2D(backbuffer, uv).rgb, 0.9);
	
	c = length(c) > 1.25 ? vec3(0.0) : c;
	
	
	gl_FragColor = vec4(c, 1.0 );

}