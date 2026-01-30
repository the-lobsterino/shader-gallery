// 050720N

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	for(float i=1.;i<64.;i++) {
		position.x += 0.5/i*sin(i*(position.y) + time);
		position.y += 0.5/i*cos(i*(position.x*position.x) + time);	
	}

	gl_FragColor = vec4( vec3(sin(position.x), sin(position.y), sin(position.x*position.y)), 1.0 );

}