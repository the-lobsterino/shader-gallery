// Self-determination for Spainand all nations

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;

// n >= 5.
float Star(vec2 p, float n, float r) {
    float rep = floor( -atan(p.x, p.y)*(n/6.28)+.5)/(n/6.28);
    float s, c;
    p = mat2(c=cos(rep), s=-sin(rep), -s, c) * p / r;
    return clamp(dot(vec2(abs(p.x), p.y-.5), vec2(sin(6.28/n), cos(6.28/n))) * resolution.y * r, 0., 1.);
}

vec3 Syrian_Flag(vec2 p) {
	return
		mix(
		    vec3(0., .48, .227),
		    mix(
			vec3(0.),
			mix(
			    vec3(1.),
			    vec3(.81, .03, .13),
			    float(p.y>.152)
			),
			float(p.y>-.152)
		    ),
		    Star(vec2(abs(p.x)-.25, p.y+.01), 5., .24)
		);
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy-resolution/2.) / resolution.y;
	
	gl_FragColor = vec4(Syrian_Flag(p), 1.);

}