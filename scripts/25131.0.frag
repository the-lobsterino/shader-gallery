#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	vec2 position = surfacePosition;//gl_FragCoord.xy / resolution.xy - vec2(0., .5);
	float scale = 4.0;
	float color = 0.1;
	
	position.x += pow(mouse.x, 3.)*1e2;
	
	for (int i=0; i<32; i++) {
		float val = sin((7e1*position.x /(0.00001+float(i)) ));
		if(abs(position.y * scale - val) < .015) color += 0.4;
	}
	
	gl_FragColor = vec4(vec3( color, 0, color), 1.0);

}