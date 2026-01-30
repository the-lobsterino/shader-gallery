#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

//the Fish. wait for it.

void main( void ) {

	vec2 pos = 2. * (gl_FragCoord.xy / resolution) - 1.;
	pos.x *= resolution.x / resolution.y;
	
	vec2 c = vec2(sin(time / 2.) * 1., sin(time * 1.) * .8);
	float d = distance(pos, c);
	float color = (2. / 64.) / sqrt(d);	
	
	float p = texture2D(backbuffer, gl_FragCoord.xy / resolution - (sin(time) * .001)).r;
	color += p* .99 * step(.5, p);

	gl_FragColor = vec4(vec3(color), 1.);
}