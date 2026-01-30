// Necip's modif.

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float color1 = 0.2+abs(sin( position.x * cos( time / 15.0 ) * 20.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 ));
	float color2 = 0.2+abs(sin( position.y * sin( time / 10.0 ) * 100.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 ));
	float color3 = 0.2+abs(sin( position.x * sin( time / 5.0 ) * 80.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 ));
	float color4 = 0.2+abs(sin( time / 1.0 ) * 0.5);
	float color = 0.2+(color1+color2+color3)*color4;
	// gl_FragColor = vec4( vec3( color, color * 0.5, abs(sin( color + time / 3.0 ) * 0.75 )), 1.0 );
	gl_FragColor = vec4( vec3(tan(position.y) * color), 1.0);

}