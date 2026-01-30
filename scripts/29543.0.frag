#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = gl_FragCoord.xy / resolution;
	

	vec3 color = vec3(0.0);
	
	
	if (position.y > .25 + sin(time*11.0 + position.x*54.0)*0.2) {
		color.b = 0.5;
	} else {
		color.r = 0.1 + sin(time*11.0 + position.x*54.0)*0.2;
	}
	

	gl_FragColor = vec4( color, 1.0 );

}