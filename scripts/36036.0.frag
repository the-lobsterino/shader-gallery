#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0 ;
	p.x *= resolution.x/resolution.y;

	float d = distance(p.x,sin(time));
	d = distance(p,vec2(sin(time*3.0),cos(time)));
	float c = smoothstep(0.1+ 0.3*sin(time),0.5 -0.4* sin(time),d);
	c = c * tan(time*2.0);

	c = abs(c);

	gl_FragColor = vec4( vec3(c, sin(c), cos(c)), 1.0);

}