#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define UNITS 200.
#define STEP 1.
#define SPEED 0.2
#define SPEED2 0.0009999999
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 colorFunc(float h) {
	float x = 1.0 - abs(mod((h * 10.) / 60.0, 2.0) - 1.0);
	
	vec3 col;
	if (h < 6.0)
		col = vec3(1.0, x, 0.0);
	else if (h < 12.0)
		col = vec3(x, 1.0, 0.0);
	else if (h < 18.0)
		col = vec3(0.0, 1.0, x);
	else if (h < 24.0)
		col = vec3(0.0, x, 1.0);
	else if (h < 30.0)
		col = vec3(x, 0.0, 1.0);
	else if (h < 36.0)
		col = vec3(1.0, 0.0, x);
	return col;
}

void main( void ) {
	float d = 3. * length(surfacePosition - vec2(0., 0.)) / (sin(sin(time * SPEED2 + time * 3.) + 200.));
	
	gl_FragColor -= vec4(1./ d, 1./d, 1./d, 1.);
	
	
	for(float i = 0.; i < 36.; i += 36. / UNITS){
		
		float d = 8.0 * length(surfacePosition/  sin(sin(time * i * SPEED2 + time * 3.) + 200.) - 0.4 * vec2(sin(time * i * SPEED + i + time * 3.) , cos(time * i * SPEED + i + time * 3.)));
		gl_FragColor += vec4(colorFunc(i)/d- 0.25, 1.0);
	}
	
	gl_FragColor = max(gl_FragColor, gl_FragColor * abs(sin(time)));
}