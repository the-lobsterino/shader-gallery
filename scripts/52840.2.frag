#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
//	mouse *= resolution;
	vec2 circles[5];
	vec2 center = (resolution / 2.0);
	circles[0] = vec2(100.0, 200.0) + center;
	circles[1] = vec2(100.0, -200.0) + center;
	circles[2] = mouse * resolution;
	circles[3] = vec2(-100.0, 0.0) + center;
	circles[4] = vec2(300.0, 0.0) + center;
	
	vec4 colors[5];
	colors[0] = vec4(1.0, 1.0, 0.0, 1.0);
	colors[1] = vec4(1.0, 0.0, 0.0, 1.0);
	colors[2] = vec4(0.0, 0.0, 1.0, 1.0);
	colors[3] = vec4(0.0, 1.0, 1.0, 1.0);
	colors[4] = vec4(0.0, 1.0, 1.0, 1.0);
	
	vec4 color = vec4(0.0);
	
	float v = 0.0;
	float vs[5];
	vec4 gradients[5];
	float x = gl_FragCoord.x;
	float y = gl_FragCoord.y;
	for (int i = 0; i < 5; i ++) {
		float r = 60.0;
		float dx = circles[i].x - x;
		float dy = circles[i].y - y;
		float dist2 = (dx * dx + dy * dy);
		vs[i] = (r * r) / dist2;
		gradients[i] = mix(colors[i], vec4(0.0), dist2 / 20000.0);
		v += vs[i];
	}
	
	if (v > 1.0) {
		for (int i = 0; i < 5; i ++) {
			color = mix(color, gradients[i], vs[i] / v);
		}
	}
	
	
	gl_FragColor = color;

}