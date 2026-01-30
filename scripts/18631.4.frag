#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 hash(vec2 uv) {
	mat2 m = mat2(15.23, 35.78, 75.86, 159.41);
	return fract(sin(m * uv) * 43758.48);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv = 2.0 * uv - 1.0;
	uv.x *= resolution.x / resolution.y;
	uv *= 3.0;
	vec2 g = floor(uv);
	vec2 f = fract(uv);
	float res = 1.0;
	for(int i = -1; i <= 1; i++) {
		for(int j = - 1; j <= 1; j++) {
			vec2 b = vec2(i, j);
			vec2 v = b + hash(g + b) - f;
			float d = length(v);
			res = min(res, d);
		}
	}
	float c = smoothstep(0.2, 0.21, res);
	
	gl_FragColor = vec4( c, c, c, 1.0 );

}