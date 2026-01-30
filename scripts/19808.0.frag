#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = -1.0 + 2.0*( gl_FragCoord.xy / resolution.xy );
	
	float dropoff = 8.0;
	if (length(position) < .9) {
		float rad = atan(position.y, position.x);
		dropoff = pow(length(position) / .7, 0.0);
		position = vec2(
			cos(rad) * .7,
			sin(rad) * .7);
	}

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( dropoff * vec3( color, color * 4.5, sin( color + time / 4.0 ) * 4.75 ), 1.0 );

}