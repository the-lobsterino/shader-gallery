#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;


void main( void ) {
	vec2 uv = (gl_FragCoord.xy - resolution * .5) / max(resolution.x, resolution.y) * 2.0;
	uv *= 1.5;
	
	float e = .1;
	for (float i=1.0;i<=125.0;i+=1.0) {
		e += 0.007/abs( (i/15.) +sin((time/2.0) + 0.15*i*(uv.y) *( cos(i/4.0 + (time / 12.0) + uv.y*11.2) ) ) + 1.5*uv.x);
	gl_FragColor = vec4( vec3(e/2.6, e/4.6, e/1.6), 2.0);	

	}
	
}