#ifdef GL_ES
precision lowp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;


void main( void ) {
	vec2 uv = (gl_FragCoord.xy - resolution * .7) / max(resolution.x, resolution.y) * 4.0;
	uv *= 1.75;
	
	float e = 1.0;
	for (float i=3.0;i<=28.0;i+=.20) {
		e += .004/abs( (i/15.5) +sin((time/1.0) + 0.15*i*(uv.x) *( sin(i/4.0 + cos(sin(time / 2.0)) + uv.x*3.2) ) ) + 1.0*uv.y);
	gl_FragColor = vec4( vec3(e/3.8, e/3.6, e/1.5), 2.0);	

	}
	
}