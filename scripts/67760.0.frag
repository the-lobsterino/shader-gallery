// N180920N

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	/* vec2 pos = gl_FragCoord.xy / resolution;
	pos = (pos * 2.0 - 1.0) * 0.1;
	pos *= vec2(resolution.x / resolution.y, 1.0); */
	
	vec2 pos = surfacePosition;
	
	pos *= .5;
	pos += .4;
	// pos += mouse * 2.0 - 1.0;
	vec2 z = vec2(0.0);
	for (int i = 0; i < 64; ++i) {
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + pos;
		if (length(z) > 2.0) break;
	}
	
	float fac = 1.0 / length(z);
	float t = 1.; // time*0.1;
	gl_FragColor.rgb = vec3(
		sin(2.0 * fac*t),
		sin(2.0 * fac*t),
		sin(2.0 * fac*t)
	);
	gl_FragColor.a = 1.0;
}