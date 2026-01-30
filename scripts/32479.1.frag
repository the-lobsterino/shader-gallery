#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = gl_FragCoord.xy / resolution.y * 10.;

	for (int i = 0; i < 10; i++) pos += cos(pos.yx*fract(sin(float(i)+.5)) + sqrt(float(i))*vec2(30,1413) + mouse);

	pos = fract(pos);
	
	float color = step(pos.x,.9)*step(pos.y,.9);
	

	gl_FragColor = vec4(color);

}