#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float radius = 0.1;
	vec2 center = vec2(0.1665);
	float cell = 0.333;
	
	float eps = 0.00125;
	float aspect = resolution.x / resolution.y;
	
	vec3 color = vec3(0.0);
	
	if(length(mod(position, cell) - center) < radius) {
		if(length(position - center - vec2(0.0, 0.0)) < radius && length(mouse - center - vec2(0.0, 0.0)) < radius) {
			color = vec3(1.0, 0.0, 0.0);
		} else if(length(position - center - vec2(0.333, 0.0)) < radius && length(mouse - center - vec2(0.333, 0.0)) < radius) {
			color = vec3(1.0, 0.0, 0.0);
		} else if(length(position - center - vec2(0.666, 0.0)) < radius && length(mouse - center - vec2(0.666, 0.0)) < radius) {
			color = vec3(1.0, 0.0, 0.0);
		} else if(length(position - center - vec2(0.0, 0.333)) < radius && length(mouse - center - vec2(0.0, 0.333)) < radius) {
			color = vec3(1.0, 0.0, 0.0);
		} else if(length(position - center - vec2(0.333, 0.333)) < radius && length(mouse - center - vec2(0.333, 0.333)) < radius) {
			color = vec3(1.0, 0.0, 0.0);
		} else if(length(position - center - vec2(0.666, 0.333)) < radius && length(mouse - center - vec2(0.666, 0.333)) < radius) {
			color = vec3(1.0, 0.0, 0.0);
		} else if(length(position - center - vec2(0.0, 0.666)) < radius && length(mouse - center - vec2(0.0, 0.666)) < radius) {
			color = vec3(1.0, 0.0, 0.0);
		} else if(length(position - center - vec2(0.333, 0.666)) < radius && length(mouse - center - vec2(0.333, 0.666)) < radius) {
			color = vec3(1.0, 0.0, 0.0);
		} else if(length(position - center - vec2(0.666, 0.666)) < radius && length(mouse - center - vec2(0.666, 0.666)) < radius) {
			color = vec3(1.0, 0.0, 0.0);
		} else {
			color = vec3(1.0);
		}

	}
	
	gl_FragColor = vec4(color, 1.0);

}