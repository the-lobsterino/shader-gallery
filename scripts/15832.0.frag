#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	float ar = resolution.x/resolution.y;
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	uv *= vec2(ar, 1);
	
	float speed = .1;
	float radius = .08;
	vec3 col = vec3(0);
	
	// moving dot
	vec2 center = vec2(fract(time*speed)*ar, .5);
	if (distance(center, uv) < radius) {
		col = vec3(1);
	}
	
	// dots
	for (int i = 0; i < 6; i++) {
		if (distance(vec2(float(i)/ar/1.6+radius*1.5, .5), uv) < radius) {
			if (uv.x < center.x && floor((uv.x)*3.2)+.1 > floor(center.x*3.2)) {
				col = vec3(1);
			}
		}
	}

	gl_FragColor = vec4(col, 1);
}