#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec2 m = vec2((mouse.x * 2.0 - 1.0) * (resolution.x / resolution.y), mouse.y * 2.0 - 1.0);
	
	float u = ((atan(p.y, p.x))*4.0);
	float t = 0.1 / abs(u - length(p));
	
	gl_FragColor = vec4(vec3(atan(p.y,p.x), 0,0), 1.0);
	
}