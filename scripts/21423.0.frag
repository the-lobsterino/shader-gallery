#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

void main( void ) {
	vec4 color;
	
	float x = gl_FragCoord.x * 256.0 * sin(time*.000005);
	float y = gl_FragCoord.y * -256.0 * cos(time*.000005);
	
	float sum = x + y;
	
	if (mod(sum, 2.0) == 0.0)
		color = vec4(1.0,1.0,1.0,1.0);
	else
		color = vec4(0.0,0.0,0.0,1.0);
	
	gl_FragColor = color;
}