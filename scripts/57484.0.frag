#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float v = 0.0;
	v += 10.0 / distance(gl_FragCoord.xy, vec2(100, 100));
	v += 10.0 / distance(gl_FragCoord.xy, vec2(200, 100));
	v += 10.0 / distance(gl_FragCoord.xy, vec2(150, 100.0 * (1.0 + sqrt(3.0) / 2.0)));
	float cl = mouse.x / 2.0;
	float cl_dist = distance(cl, v);
	vec4 color = vec4(v);
	if (cl_dist < 0.1 && cl_dist > 0.09) {
		color.r += cl_dist;
	}
	gl_FragColor = color;
	

}