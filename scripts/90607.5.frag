#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	
	vec3 col;
	if (position.y > .5 + .01 * sin(10. * position.x + time)) {
		col = vec3(0., 87./255., 184./255.);
	}
	else {
		col = vec3(254./255., 221./255., 0.);
	}
	
	gl_FragColor = vec4(col, 1.);
}
