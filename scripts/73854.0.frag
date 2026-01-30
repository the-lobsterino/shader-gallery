#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 bgcolor = vec3(0.36, 0.176, 0.407);

void bg(vec2 p, inout vec3 c) {
	float f = cos(-p.x) * cos(p.y);
	f = cos(p.x);
	c = bgcolor * f;
}

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 5.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 3.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void line(vec2 p, inout vec3 c) {
	for (float fi = 0.; fi < 50.; ++fi) {
		float offset = fi / 50.;
		float val = sin(time + fi);
		float timer = time * fi * (.03 * abs(sin(time * 0.01)));
		vec3 color = hsv((fi + time) * .0275, 0.3, val);
		c += .015 / abs(p.y + cos(p.x + timer + offset)) * color;
	}
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 color = vec3(1.);
	bg(position, color);
	line(position, color);
	gl_FragColor = vec4(color, 1.0 );
}