#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 20.0;

	float color = 0.0;
	vec4 color1 = vec4(1.0,0.0,0.0,1.0);
	vec4 color2 = vec4(1.0,1.0,0.0,1.0);
	
	
	int px = int(mod(position.x,2.0));
	int py = int(mod(position.y,2.0));
	
	bool value = (px == 0 && py == 0) || (px == 1 && py == 1);
	
	if (cos(time*8.0) > 0.0) value = !value;
	
	gl_FragColor = value ? color1 : color2;
}