#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = ((gl_FragCoord.xy / resolution.xy) * 2. - 1.) * vec2(resolution.x / resolution.y, 2.0);
	
	float a = atan(uv.y / uv.x);
	uv.y += cos(12.0*uv.x + time * 5.0) * 0.02;
	uv.x += sin(12.0*uv.y + time * 5.0) * 0.02;
	uv.y += cos(12.0*uv.x + time * 5.0) * 0.02;
	uv.x += sin(12.0*uv.y + time * 5.0) * 0.02;
	uv.y += cos(12.0*uv.x + time * 5.0) * 0.02;
	uv.x += sin(12.0*uv.y + time * 5.0) * 0.02;
	uv.y += cos(12.0*uv.x + time * 5.0) * 0.02;
	uv.x += sin(12.0*uv.y + time * 5.0) * 0.02;
	uv.y += cos(12.0*uv.x + time * 5.0) * 0.02;
	uv.x += sin(12.0*uv.y + time * 5.0) * 0.02;
	uv.y += cos(12.0*uv.x + time * 5.0) * 0.02;
	uv.x += sin(12.0*uv.y + time * 5.0) * 0.02;
	uv.y += cos(12.0*uv.x + time * 5.0) * 0.02;
	uv.x += sin(12.0*uv.y + time * 5.0) * 0.02;
	uv.y += cos(12.0*uv.x + time * 5.0) * 0.02;
	uv.x += sin(12.0*uv.y + time * 5.0) * 0.02;
	
	if (length(uv) < 01.4)
		gl_FragColor = vec4(.0, .0, .0, 1);
	else
		gl_FragColor = vec4(.0, 1.0, 1.0, 1);
}