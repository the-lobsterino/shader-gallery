#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	
	vec3 r = 0.5-normalize(1.0 - dot(uv, uv) * log(time) * uv.y + cos(1.6*time+uv.xyy*vec3(1,2,6)));
	gl_FragColor = vec4(r,1.0);
}