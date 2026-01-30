#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;



void main( void ) {
	vec2 uv = (gl_FragCoord.xy - resolution * 0.7) / max(resolution.x, resolution.y) * 3.0;
	uv *= 5.0;
	
	float e = 0.0;
	for (float i=1.0;i<=50.0;i+=1.0) {
		e += .005/abs( (i/225.) +tan((time/3.0) + .15*i*(uv.x) *( sin(i/3.0 + (time / 12.0) + uv.x*.2) ) ) + 2.5*uv.y);
	gl_FragColor = vec4( vec3(e/20.0, e/3.0, e/1.6), 20.0);	

	}
	
}