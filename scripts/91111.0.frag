#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	
	vec3 col;
	float tilt = .01 * sin(10. * position.x + time);
	
	if (position.y > (2./3.) + tilt) {
		col = vec3(1., 1., 1.);
	}
	else if (position.y > (1./3.) + tilt) {
		col = vec3(.1, .3, 1.);
	}
	else {
		col = vec3(1., .0, .2);
	}
	
	gl_FragColor = vec4(col, 1.);
}
