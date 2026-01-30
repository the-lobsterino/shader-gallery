#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2;
uniform vec2 resolution;

void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy - resolution.xy*.5) + resolution*vec2(.15, 0);
	uv += sin(uv.x*0.011 + time*5.)*8.192;

	float mm = 1.0+0.01*sin(uv.x*0.011 +time*5.)*8.192;

	float w = resolution.y * .1;
	if (abs(uv.x) > w && abs(uv.y) > w)
		gl_FragColor = vec4( .1, .2, 8., 1.0 )*mm;
	else
		gl_FragColor = vec4( .8, .7, .1, 1.0 )*mm;
}