#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(float x, float a1, float a2, float b1, float b2){
	return b1 + (b2 - b1) * (x - a1) / (a2 - a1);
}

void main( void ) {
        vec2 uv = gl_FragCoord.xy / resolution;
	float aspect = resolution.x / resolution.y;
	
	vec3 color = vec3(uv.x, 0.0, uv.y);
	uv.x *= aspect;
	
	vec2 mouse_v = mouse;
	mouse_v.x *= aspect;
	
	float radius = map(sin(time), -1.0, 1.0, 0.25, 0.3);
	
	if (distance(uv, mouse_v) < radius){
	        color.r = 1.0 - color.r;
		color.b = 1.0 - color.b;
	}
	

	gl_FragColor = vec4(color, 1.0);

}