#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution)/max(resolution.x, resolution.y);

	float color = p.x*p.x + pow(5.0 *p.y / 4.0 - sqrt(abs(p.x)), 2.0);
	

	gl_FragColor = vec4(vec3(color * 25.0 * abs(sin(time * 2. * 3.1415 ))), 1.0);

}