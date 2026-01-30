#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 0.01

void main( void ) {
	float required_time = 5.0;
	float speed = 1.0 / required_time;
	float width = 0.005;
	vec3 color = vec3(0.0);
	
	float current_time = mod(time, required_time);
	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	
	float current_pos = 1.0 - speed * current_time;
	
	if ((pos.y <= current_pos + width / 2.0) && (pos.y >= current_pos - width / 2.0))
		color = vec3(0.0, 1.0, 0.0);
	
	gl_FragColor = vec4(color, 1.0 );

}