#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float factor = 50.0;
	vec2 res = resolution / factor;

	vec2 center = vec2((time - res.x * floor(time / (res.x))) * factor, (time - res.y * floor(time / res.y)) * factor);
	float val = sqrt(pow(gl_FragCoord.x - center.x, 2.0) + pow(gl_FragCoord.y - center.y, 2.0));
	gl_FragColor = vec4( 1.0, 1.0, 1.0, (100.0 / val) * sin(val / sqrt(pow(res.x, 2.0) + pow(res.y, 2.0)) / radians(500.0)) );

}