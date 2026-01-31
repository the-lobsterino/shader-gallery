#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec3 c;
	vec2 position = ( gl_FragCoord.xy / resolution.y );
	vec3 pos = vec3(sin(position + vec2(time, time / 3.5)) / 2.0 + 0.5, 0);
	float ratio = resolution.x / resolution.y;
	
	if (mod(position.y, 0.1) <= 0.05) {
		c = vec3(step(0.1,mod(position.x + position.y  + (sin(time - 1.) - 0.5) * 1.5 * (position.y - 0.5) + time * 0.1 , 0.2)));
	} else {
		c = vec3(step(0.1,mod(position.x + (0.5 + position.y) + (sin(time) - 0.5) * 2.0 * (position.y - 0.5) + time * -0.2 , 0.2)));
	}

	gl_FragColor = vec4( vec3( c ) * pos, 1.0 );

}