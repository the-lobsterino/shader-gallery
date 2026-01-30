#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = (gl_FragCoord.xy / resolution.xy) + vec2(mouse.x / 10.0, mouse.y / 4.0);

	float color = 2.0;
	float r = 1.6;
	float g = 1.0;
	float b = 1.2;
	
	color -= sin(uv.x * 60.0) * 0.25 + sin(uv.x * 100.0) * 0.25 + 0.5;
	
	color -= sin(uv.y * sin(uv.x         * 5.0) * 50.0) * 0.05;
	color -= sin(uv.y * sin((1.0 - uv.x) * 5.0) * 50.0) * 0.05;
	
	color -= sin(uv.y * sin(uv.y + cos(uv.x)       * 2.0) * 100.0) * 0.15;
	color -= sin(uv.y * sin(uv.y + cos(1.0 - uv.x) * 2.0) * 100.0) * 0.15;
	
	color -= sin((uv.y - 1.5) * sin(uv.y + cos(uv.x - 1.0)       * 2.0) * 80.0) * 0.15;
	color -= sin((uv.y - 1.5) * sin(uv.y + cos(1.0 - uv.x - 1.0) * 2.0) * 80.0) * 0.15;
	
	color -= sin(uv.y * 5.0) * 0.5 + sin(uv.y * 2.5) * 1.5;
	
	gl_FragColor = vec4(vec3(color * r, color * g, color * b), 1.0);
	//gl_FragColor += vec4(vec3(1.0 - color), 1.0);

}
