#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



vec2 rot(vec2 p, float a) {
	return vec2(
		p.x * cos(a) - p.y * sin(a),
		p.x * sin(a) + p.y * cos(a));
}

#define DIV_FL 16
#define PI     3.14
vec4 getcol(vec2 uv) {
	vec4 col = vec4(1.0);

	float a  = 0.0;
	float da = 180.0 / float(DIV_FL);
	for(int i = 0 ; i < DIV_FL; i++) {
		vec2 tuv = rot(uv, a + time);
		tuv.x *= 8.0;
		tuv.y *= 0.0500;
		col += vec4(1.0 - pow(dot(tuv, tuv), 0.07));
		a += da;
		
	}
	return vec4(col / float(DIV_FL / 3) + fract(1.0 - time * 15.0) * 0.3);
}

void main( void ) {
	vec2 uv = -1.0 + 2.0 * ( gl_FragCoord.xy / resolution.xy );
	uv.x *= resolution.x / resolution.y;
	gl_FragColor = getcol(uv);
}
