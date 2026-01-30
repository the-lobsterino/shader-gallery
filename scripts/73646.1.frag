#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float tw(float speed)
{
	return sin(time * speed) * 0.5 + 0.5;
}

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}


void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
	vec3 color;
	uv = 1.0 * tw(0.3) * uv + 0.1 * tw(1.0);
	uv = rotate(uv, time * 3.);	
	uv.x = length(uv); 	
	uv = rotate(uv, time * 3.);
	//uv = cos(uv) * sin(uv);
	uv.y = sin(length(tw(3.0)*2.2*uv)) + uv.y;
//	uv = rotate(uv, time);
	uv.x*= uv.y * tw(1.0)*10.0;
//	uv = rotate(uv, time);
	float t = uv.x * 100. + time * 50. * tw(0.01);
	for (int i = 0; i < 3; i++) {
		float d = abs(uv.y - sin(radians(t)) * .28);
		color[i] = .05 / (d * d);
		t += 120.;
	}
	gl_FragColor = vec4(color, 1);
}
