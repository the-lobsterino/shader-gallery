// Conway's game of life

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec4 live = vec4(0.5,1.0,0.7,1.);
vec4 dead = vec4(0.,0.,0.,1.);
vec4 blue = vec4(9.,9.,9.,9.);

float k = 0.99;



void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	if (length(position-mouse) < 0.02) {
		gl_FragColor = vec4(vec3(2.0), 1.0);
		return;
	}
	if (time < 0.1) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
		return;
	}
	vec2 pixel = 1.0 / resolution;
	float sum = 0.0;
	sum += texture2D(backbuffer, position + pixel * vec2(-1., -1.)).r;
	sum += texture2D(backbuffer, position + pixel * vec2(-1., 0.)).r;
	sum += texture2D(backbuffer, position + pixel * vec2(-1., 1.)).r;
	sum += texture2D(backbuffer, position + pixel * vec2(1., -1.)).r;
	sum += texture2D(backbuffer, position + pixel * vec2(1., 0.)).r;
	sum += texture2D(backbuffer, position + pixel * vec2(1., 1.)).r;
	sum += texture2D(backbuffer, position + pixel * vec2(0., -1.)).r;
	sum += texture2D(backbuffer, position + pixel * vec2(0., 1.)).r;
	float r = texture2D(backbuffer, position).g;
	vec4 s = vec4(
		texture2D(backbuffer, position + pixel * vec2(-1.0, 0.0)).r,
		texture2D(backbuffer, position + pixel * vec2(1.0, 0.0)).r,
		texture2D(backbuffer, position + pixel * vec2(0.0, -1.0)).r,
		texture2D(backbuffer, position + pixel * vec2(0.0, 1.0)).r
	);
	for (int i = 0; i < 10; i++ ) {
		r += 0.01 * (
			texture2D(backbuffer, position + pixel * vec2(-1.0, 0.0)).r +
			texture2D(backbuffer, position + pixel * vec2(1.0, 0.0)).r +
			texture2D(backbuffer, position + pixel * vec2(0.0, -1.0)).r +
			texture2D(backbuffer, position + pixel * vec2(0.0, 1.0)).r
		);
	}
	float v = texture2D(backbuffer, position).r;
	v = v + k * (sum / 8.0 - v);
	gl_FragColor = vec4(vec3(v), 1.0);
	
}