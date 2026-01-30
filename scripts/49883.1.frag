#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	float time = time - .05*dot(pos, pos);
	pos.x /= atan(1.-pow(.5+.5*cos(time*3.14159), 100.));
	pos.y /= atan(1.-pow(.5+.5*cos(3.1415+time*3.14159), 100.));
	float d = distance(vec2(0.0, 0.0), pos);

	gl_FragColor = vec4( vec3(1.0, d, 1.0),  1.0 );

}