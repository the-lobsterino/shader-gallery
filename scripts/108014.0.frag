#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy * resolution.x+0.2 +  resolution.y) *.00001;

	float color = 1.0;
	color += sin( position.x * 2.0)*sin( position.x *2.0 + time);
  	color += cos( position.x + time* 2.0)* sin( position.y + time*5.0);
	color += cos( position.y * 120.0)*sin( position.x *120.0 + time);
	gl_FragColor = vec4( vec3( position.x+color, color+0.001 ,position.y/2.0),0.9);
}
