#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(vec3 p) {
	float c = .5;
	p = mod(p, .5) - .25;
	return length(p) - .1 + sin(time * 10.) * .01;
}

vec3 norm(vec3 p) {
	vec2 e = vec2(.001, 0.);
	return normalize(vec3(
		f(p + e.xyy) - f(p - e.xyy),
		f(p + e.yxy) - f(p - e.yxy),
		f(p + e.yyx) - f(p - e.yyx)
	));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )* 2. - 1.;

	position.x *= resolution.x / resolution.y;
	
	float time = time;
	time *= 2.;
	vec2 offset = vec2(sin(time), cos(time));
	
	vec3 p = vec3(offset, -time * 3.);
	float phi = time;
	position *= mat2(cos(phi), -sin(phi), sin(phi), cos(phi));
	vec3 d = normalize(vec3(position + offset, -tan(radians(45.))));
	
	vec3 color = vec3(0.);
	
	for(int i = 0; i < 64; i++) {
		float delta = f(p);
		if(abs(delta) < .01) {
			color = mix(vec3(1., 0., 0.), vec3(0., 1., 0.), sin(time * 4. + p.z) * .5 + .5) * dot(norm(p), vec3(0., 0., 1.)) + vec3(.1);
		}
		p += d * delta;
	}
	
	gl_FragColor = vec4(color, 1.0 );

}