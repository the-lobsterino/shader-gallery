#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define add_circle(pos) clamp(1.-((length(uv-(pos))-.01)*500.),0.,1.)
void main( void ) {
	vec2 uv = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
	uv.y *= resolution.y/resolution.x;
	vec3 c = vec3(0);
	for (float i = -1.; i <= 1.; i+=.05) { //Begin at -1. Add 0.05 until it reaches 1.
		c += add_circle(vec2(i,(sin(i+time))/2.));
	}
	gl_FragColor = vec4(c, 1.0 );

}