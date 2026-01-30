#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float radius = 0.002;
const float scale = 0.5;
const float PI = 3.141592;

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.y;
	vec3 col = vec3(0.0);
	
	for (float i=0.; i<2.*PI; i+=0.1){
		float x = sin(i * time - mouse.x) * scale;
		float y = cos(i * time - mouse.y) * scale;
		
		float c = radius / length(uv - vec2(x + 0.85, y + 0.5));
		col += vec3(c, 0., c);
	}
	
	float m = 0.01 / length(uv - vec2(mouse.x * 1.778, mouse.y));
	col += vec3(m, 0., m);
	
	gl_FragColor = vec4(col, 1.0);

}