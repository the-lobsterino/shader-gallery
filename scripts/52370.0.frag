#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
vec2 FRACTALIZE(vec2 p) {
	float s = .5;
	float cs = cos(time);
	float sn = sin(time);
	mat2 rot = mat2(cs, sn, -sn, cs);
	for (int i = 0; i < 4; i++) {
		p = abs(p) - s;
		p *= rot;
		s *= .995;
	}
	return p;
}
vec3 hsv2rgb (in vec3 hsv) {
	hsv.yz = clamp (hsv.yz, 0.0, 1.0);
	return hsv.z * (1.0 + 0.5 * hsv.y * (cos (1.0 * 3.14159 * (hsv.x + vec3 (0.0, 2.0 / 3.0, 1.0 / 3.0))) - 1.0));
}

float rand (in vec2 seed) {
	return fract (sin (dot (seed, vec2 (12.9898, 78.233))) * 137.5453);
}

void main () {
	vec2 frag = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;
	
	//frag *= 1.0 - 0.2 * cos (frag.yx) * sin (3.14159 * 0.1);// * texture (iChannel0, vec2 (0.0)).x);
	frag *= 0.5 + 9.25 * (.5 + .5 * cos(time / 3.));
	
	;
	float random = rand (floor (frag));
	vec2 black = smoothstep (1.0, 0.9, cos (frag * 3.14159 * 2.0));
	vec3 color = vec3(1.0); //hsv2rgb (vec3 (random, 1.0, 1.0));
	color *= black.x * black.y * smoothstep (1.0, 0.1,length(fract(frag) - 0.5));
	color *= 0.5 + 0.5 * cos (random + random * time + time + 3.14159 * 0.); // * texture (iChannel0, vec2 (0.7)).x);
	vec2 uv = FRACTALIZE(fract(frag) - .5);
	float k = length(uv);
	color += 0.5 * (k);
	gl_FragColor = vec4 ((color) * vec3(1.0,1.0,1.0), 1.0);
}
