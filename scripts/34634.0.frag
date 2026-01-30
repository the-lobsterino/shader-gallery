#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec2 p2 = p;
	vec2 m = vec2((mouse.x * 2.0 - 1.0) * (resolution.x / resolution.y), mouse.y * 2.0 - 1.0);
	
	p /= dot(p,p)*0.3;
	m /= dot(m,m)*0.3;
	float t = sin(length(m - p) * 30.0 + time * 5.0);
	t *= sin(length(p) * 30.0 + time * 5.0);
	t*=smoothstep(0.13,0.46,length(p2));
	gl_FragColor = vec4(vec3(t), 1.0);

}