#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 transform(vec2 uv) {
	uv = .5 * (uv - uv.yx * vec2(1., -1.));
	uv += sign(uv) * min(abs(uv.x), abs(uv.y));
	return uv;
}

void main( void ) {
	const int n = 3;
	
	vec2 position = (gl_FragCoord.xy * 2. - resolution) / resolution.y * float(n + 1);
	vec3 col = vec3(.5);
	
	for (int i = -n; i <= n; i++) {
		for (int j = -n; j <= n; j++) {
			float t = mod(floor(time), 8.) + fract(time) * fract(time) * (3. - 2. * fract(time));
			vec2 new = vec2(i, j);
			for (int k = 0; k < 8; k++) {
				if (t < 0.) {
					break;
				}
				new = mix(new, transform(new), min(t, 1.));
				t--;
			}
			if (distance(position, new) < 0.25) {
				col *= vec2(i + n, j + n).xyx / float(2 * n + 1);
			}
		}
	}
	
	gl_FragColor = vec4(col, 1.);

}