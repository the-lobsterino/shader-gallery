#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + time/20.0;

	float color = 0.0;
	color += floor(sin( position.x * 160.0) + cos( position.y * 80.0 ))*1.0;

	gl_FragColor = vec4(vec3( color, color + sin(time), color + 0.5), 1.0 );

}