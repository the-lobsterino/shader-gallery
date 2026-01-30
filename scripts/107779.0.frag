#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec4 O = vec4(0.0);
	float maxCoord = max(resolution.x, resolution.y);
	float ratio = resolution.y / resolution.x;
	
	vec2 u = gl_FragCoord.xy/maxCoord - vec2(0.5, ratio * 0.5);
	u *= 4.0;
	float T = time;
	for (float i = 0.; i < 100.0; i += .5) {
	O += .001/abs(length(u + vec2(tan(i/4. + T), tan(i*.45 + T)) * sin(T*.5+i*.35)) - tan(i+T*.5) / 60. - .01) * (1. + tan(i*.7 + T + length(u)*6. + vec4(0,1,2,0)));
	}
	
	gl_FragColor = O;
	
	return;

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 74.8;

	float color = 0.0;
	color += tan( position.x * tan( time / 15.0 ) * 80.0 ) + tan( position.y * tan( time / 15.0 ) * 10.0 );
	color += tan( position.y * tan( time / 25.0 ) * 40.0 ) + tan( position.x * tan( time / 25.0 ) * 40.0 );
	color += tan( position.x * tan( time / 5.0 ) * 10.0 ) + tan( position.y * tan( time / 15.0 ) * 80.0 );
	color *= tan( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, tan( color + time / 0.5 ) * 0.75 ), 1.0 );

}