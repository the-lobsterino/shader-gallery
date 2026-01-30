#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float tw()
{
	return sin(time) * 0.5 + 0.5;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * tw() * 3.0 - 1.5 * tw() * resolution) / resolution.y;
	vec3 color;
	float t = uv.x * 600. * tw() * 3.0 + time * 50.;
	for (int i = 0; i < 3; i++) {
		float d = abs(uv.y - cos(radians(t)) * .3);
		color[i] = .05 / (d * d) * 2.- tw();
		t += 120. + (1.63-tw())*1000.;
	}
	gl_FragColor = vec4(color, 1);
}
