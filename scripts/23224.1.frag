#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float mouseThres = 0.002;

// trying to make magnetic field lines but failing

void main( void ) {
	float aspect = resolution.x / resolution.y;
	vec2 pos = gl_FragCoord.xy / resolution.x - vec2(0.5, 0.5 / aspect);
	vec2 m = vec2(mouse.x - 0.5, (mouse.y - 0.5) / aspect);

	vec2 p1 = pos - m;
	vec2 p2 = pos + m;

	float color = 0.0;
	if (length(p1) < mouseThres || length(p2) < mouseThres) color = 1.0;

	vec2 p3 = pos;
	color = pow(sin(pow(length(p1), 0.25) * 256.0) + sin(pow(length(p2), 0.25) * 256.0), 4.0);
	if (color > 0.01) color = 0.01 / color;
		else color = 1.0;
	
	
	color = (color * (1.0 - sin(pow(length(p3), 0.25) * 4.0))) * 0.5;
	gl_FragColor = vec4(color, color, color, 1.0 );

}