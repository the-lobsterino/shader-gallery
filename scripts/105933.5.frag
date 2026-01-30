#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = vec2(gl_FragCoord.xy / resolution.xy) * 2. + (1. - mouse.xy - 1.5);
	uv.x *= resolution.x/resolution.y;
	uv = fract(uv) - 0.5;
	vec2 uv0 = uv;
	vec3 col = vec3(3.,1.,3.);
	float d = length(uv);
	d = tan(d*8.+(time*3.))/8.;
	d = abs(d);
	d = 0.01/d;
	col *= d;
	gl_FragColor = vec4(col, 1.0 );

}