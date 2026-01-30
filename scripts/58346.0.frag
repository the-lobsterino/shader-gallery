#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dscene(vec3 p) {
	return distance(p, vec3(0, 0, -10.0)) - 6.0;
}

void main( void ) {

	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 ro = vec3(0.0, 0.0, 0.0);
	vec3 rd = normalize(vec3(uv, -1.0));

	vec3 color = vec3(0.0);
	for (int i = 0; i < 100; ++i) {
		float d = dscene(ro);
		ro += d * rd;
		if (d < 0.0001) {
			color = vec3(1.0);
			break;
		}
	}
		
	gl_FragColor = vec4( vec3(exp2(-length(ro * 0.3))) * color, 1.0 );

}