#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
mat2 rotate(float a) {
	float c = cos(a), s = sin(a);
	return mat2(c, -s, s, c);
}
 
 
void main() {
	vec2 p = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec2 q = vec2(atan(p.y, p.x) + time * .25, length(p));
	
	vec3 color = vec3(.3);
	
	float f = 7.;
	float r = .2 * cos(f * q.x) + .5;
	color += smoothstep(r + .015, r, q.y);
	
	r = .2 * cos(f * q.x) + .5;
	color *= smoothstep(r / 2., r / 2. + .015, q.y);
	color *= .2 + .258 * cos(f * q.x);
	color += pow(.7 * cos(f  * q.x), 3.5);
	
	r = .2 * cos(f * q.x) + .5;
	color -= vec3(smoothstep(r, r + .015, q.y));
	r = .2 * cos(f * q.x) + .5;
	color *= smoothstep(r / 2., r / 2. + .015, q.y);
	
	gl_FragColor = vec4(color, 1.);
}
