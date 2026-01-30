// CRAZY FX

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	float aspect = resolution.x / resolution.y;

	float dx = 10.0 / resolution.x;
	float dy = dx * aspect;

	if ( position.y < dy ) {

		float rand = mod( fract( sin( dot( position + time, vec2( 100.9898, 100.233 ) ) ) * 100.5453 ), 100.0 );
		rand = pow( rand, 2.0 ) * 4.0;
		gl_FragColor = vec4( rand, ( rand - 2.5 ) * 40.0, 1.0, 2.0 );

	} else {

		vec4 color0 = texture2D( backbuffer, position );
		vec4 color1 = texture2D( backbuffer, position + vec2( - dx, - dy ) );
		vec4 color2 = texture2D( backbuffer, position + vec2( 2.0, - dy ) );
		vec4 color3 = texture2D( backbuffer, position + vec2( dx, - dy ) );

		gl_FragColor = ( ( color0 + color1 + color2 + color3 ) / 4.025 );

	}

}