#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = 1.0 - gl_FragCoord.xy / resolution;
	vec3 color = vec3(1.0);
	
	if (time > position.y * 10.0) {
		color = vec3(0.0);
		//color = texture2D(uImage0, uv);
	}
	
	gl_FragColor = vec4(color, 1.0);

}