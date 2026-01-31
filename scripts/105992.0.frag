#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 position = 0.4* ( gl_FragCoord.xy / resolution.xy ) + vec2(time/60.0,0.0);

	float color = 0.0;
	color += floor(sin( position.x * 180.0) / cos( position.y * 120.0 ));

	gl_FragColor = vec4(vec3( color+0.99, color +0.0, color+.0 ), 1.0 );

}