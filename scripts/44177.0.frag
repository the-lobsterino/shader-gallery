#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float t = time * 3.0;
	
	float a[7];
	a[0] = 0.5;
	a[1] = 0.2 * sin(t * 0.19);
	a[2] = 0.2 * sin(t * 0.13);
	a[3] = 0.2 * sin(t * 0.17);
	a[4] = 0.2 * sin(t * 0.1);
	a[5] = 0.2 * sin(t * 0.21);
	a[6] = 0.2 * sin(t * 0.23);
	
	float x = position.x;
	float intensity = 0.5;

	for(int i=1; i<7; i++) {
		intensity += cos(x * float(i) * 3.141592) * a[i];
	}


	intensity = clamp(intensity, 0.0, 1.0);
	
	gl_FragColor = vec4(pow(vec3(1.0, 0.6, 0.2) * pow(intensity, 5.0), vec3(2.0 / 2.4)), 1.0);
}