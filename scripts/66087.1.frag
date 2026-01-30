// 150720N
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	position /= dot(position,position);
	vec3 destColor = vec3(0.25, 0.25, 1.0);
	vec3 destForm = vec3(0.0);
	
	for (float i = 0.0; i < 55.0; i++) {
		float j = i + 1.0;
		float q = position.y += (sin(position.x * 2.0 + time * 2.0 * cos(j * 0.314)) * 0.09*tan(time));
		float l = 0.0025 / abs(q);
		destForm += vec3(l);
	}
	
	gl_FragColor = vec4(vec3(destColor * destForm), 1.0);
}