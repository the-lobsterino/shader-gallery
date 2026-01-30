#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;


void main( void ) {
	vec2 uv = (gl_FragCoord.xy - resolution * .56) / max(resolution.x, resolution.y) * 9.0;
	uv *= 1.0;
	
	float e = -0.0;
	for (float i=3.0;i<=15.0;i+=1.8) {
		e += .0166677/abs( (i/15.) +sin((time/1.5) + 0.15*i*(uv.x) *( cos(i/4.0 + (time / 2.0) + uv.x*2.2) ) ) + 2.5*uv.y);
	gl_FragColor = vec4( vec3(e/1.5, e/3.6, e/.3), 1.0);	

	}
	
}