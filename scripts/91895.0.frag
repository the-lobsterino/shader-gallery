
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	
	float str = 4.0 + sin(time);
	

	gl_FragColor = vec4(vec3(str), 1.0);

}