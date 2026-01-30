#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;



void main( void ) {
	vec2 uv = (gl_FragCoord.xy - resolution * .5 ) / max(resolution.x/555.0, resolution.y) * 5.0;
	uv *= 1.5*uv/5.0;
	
	float e = 1.5;
	for (float i=2.0;i<=70.0;i+=1.0) {
		e += .004/abs( (i/425.) +tan((time/1.0) + .25*i*(uv.x) *( sin(i/2.0 + (time/time / 2.0) + uv.x*.2) ) ) + 1.25*uv.y);
		
	float f = e/1.5;

	gl_FragColor = vec4( vec3(e-f-e/144.0, e/4.0, e/25.6), 10.0/uv-uv*uv.y);	

	}
	
}