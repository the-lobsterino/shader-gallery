#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(.5,.5);
	float horizon = 0.0;
	float angle = 2.0*3.14*sin(time/4.0);
	float scale = 0.1;
	
	vec3 p = vec3(pos.x, .1, pos.y-horizon);
	vec2 s = p.xy/p.z*scale;
	
	// rotation
	s = vec2(s.x*cos(angle) - s.y*sin(angle), s.x*sin(angle) + s.y*cos(angle));
	
	float color = sign((mod(s.x, 0.1) - 0.05) * (mod(s.y, 0.1) - 0.05));
	color *= p.z*p.z*20.0;


	gl_FragColor = vec4( color*vec3(.1,.5,.4), 1.0);

}