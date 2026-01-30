#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sineLine( vec2 position, float speed, float timeoffset) {
	
	float sv = sin(position.x + time * speed + timeoffset);
	sv *= 0.5;
	sv += 0.5;
	
	float yd = position.y - sv;
	yd = 1.0 - abs(yd);
	yd = yd * yd * yd;	
	return yd;
}

void main( void ) {
	float aspectRatio = resolution.x / resolution.y;
	vec2 position = ( gl_FragCoord.xy / resolution.xy);
	
	
	float r = sineLine(position, 1.0, 0.0);
	float g = sineLine(position, 1.1, 0.0);
	float b = sineLine(position, 1.2, 0.0);
	
	
	
	vec3 color = vec3(r, g, b);
	gl_FragColor = vec4( color, 1.0 );

}