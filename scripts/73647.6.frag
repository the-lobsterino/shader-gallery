#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}


float tw()
{
	return sin(time) * 0.5 + 0.5;
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.y;
	uv.y = uv.y - 0.5;
	uv.x = uv.x - 1.0 - sin(time/4.0);
	uv = rotate(uv, time * 0.5) * length(uv)/3.;
	uv = 0.3 * uv * length(uv + sin(time) + 2.0 * tw());
	uv = floor(uv * 20.) / 20.0 + tw();
	
	vec3 color;
	float t = uv.x * 120.0 + 45.0 * time;
	for (int i = 0; i < 3; i++) {
		float d = sin(radians(t)) * 0.5 + 0.5;
		color[i] = d;
		t -= 120.;
	}
	gl_FragColor = vec4(color, 1);
}
