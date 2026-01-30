#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = ((gl_FragCoord.xy / resolution.xy) * 2. - 1.) * vec2(resolution.x / resolution.y, 1.0);
	
	float a = atan(uv.y / uv.x);
	uv.y += sin(20.0*uv.x + time * 5.0) * 0.02;
	
	if (length(uv) < 0.4)
		gl_FragColor = vec4(1.0, .0, .0, 1);
	else
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1);
}