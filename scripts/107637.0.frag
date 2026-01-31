#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float color;
	float cyclicTime = fract(time / 2.0)*1000.0;
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 center = resolution.xy / 2.0;
	float dist = ((cos(gl_FragCoord.x / 7.5) + sin(gl_FragCoord.y / 9.0))/5.+ 2.7) * length(gl_FragCoord.xy - center);
	if(abs((cyclicTime) - dist + cos(dist*dist/10.0)*20.0) < 50.0) {
		color = dist / 700.0;
	} else {
		color = 1.0;
	}

	gl_FragColor = vec4((1.0 -color) * (1.0 - color), 1.0 - color - dist / 800.0,  0.5 - color/2.0, 1.0);
}