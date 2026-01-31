/* Free Palestine */

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;

#define ry resolution.y

vec3 Palestine_Flag(vec2 p) {
	return
		mix(
			vec3(.93, .18, .22),
			mix(
				vec3(clamp((-p.y+.667)*ry, 0., 1.)),
				vec3(
					mix(
						vec3(1.),
						vec3(.004, .59, .228),
						clamp((-p.y+.333)*ry, 0., 1.)
					)
				),
				float(p.y<.5)
			),
			clamp(dot(vec2(p.x, abs(p.y-.5)-.5), normalize(vec2(.76, 1.))) * ry, 0., 1.)
		);
}

void main( void ) {
	vec2 p = gl_FragCoord.xy / ry;
	
	gl_FragColor = vec4(Palestine_Flag(p), 1.);

}