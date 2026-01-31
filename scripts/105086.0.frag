#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	float two = 0.0;
	position.x -= 0.5;
	position.y -= 5.5;
	color += sin(position.x*sin(2.*time/4.)/position.y-time*10.);
	color /= cos(position.x/position.y-time);
	two = sin(position.x*100. + time*50.);

	gl_FragColor = vec4( vec3(two,color,color*.5 ), 1.0 );

}