#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float boxsize = 0.025;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	vec2 ballPosition = (abs(fract(vec2(time, time * 0.5) * 0.5) * 2.0 - 1.0) * 2.0 - 1.0) * (1.0 - boxsize * 2.0) * 0.5 + 0.5;

	vec3 color = vec3(0.0);
	
	color += step(max(abs(position.x - ballPosition.x), abs(position.y - ballPosition.y)), boxsize);

	if (sqrt(pow(distance(position.x, ballPosition.x), 2.0) - pow(distance(position.y, ballPosition.y), 1.0)) < boxsize+0.5) {
		color = vec3(1.0);
	}
		
	
	gl_FragColor = vec4(color, 1.0 );

}