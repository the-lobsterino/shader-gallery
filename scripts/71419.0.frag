#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define PI 3.14159265359

void main( void ) {

	vec2 position = surfacePosition;// ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += (   ( sin(time * PI) * cos(time * PI) + position.x ) * ( sin(time * PI) * sin(time * PI) + position.y  )
		 );
	color += cos(time * PI) * atan(time * PI);

	gl_FragColor = vec4( vec3( (sin(color)*cos(color*time)), (sin(color)*cos(color*time)), (sin(color)*cos(color*time)) ), 1.0 );

}