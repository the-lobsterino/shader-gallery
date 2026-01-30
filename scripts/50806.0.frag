#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool bounds(vec2 element_pos, vec2 position) {
	return (3.0 * sqrt(pow(distance(element_pos.x, position.x), 2.0) + pow(distance(element_pos.y, position.y), 2.0))) < 0.05;
}

void main( void ) {
	
	vec2 position = (gl_FragCoord.xy / resolution);
	
	vec2 pos = vec2(0.1, 0.9);
	
	float cycletime = mod(time, 5.0);
	float meter = 0.01;
	
	float yfloor = 0.1;
	vec2 vector = vec2(5.0 * meter, 0.0 * meter);
	float gravity = -9.8 * meter;
	
	vector += vec2(cycletime * vector.x, (0.5 * gravity) * pow(cycletime, 2.0));
	
	if(pos.y < yfloor){
		vector = vec2(vector.x, -vector.y);	
	}
	
	pos += vector;
	
	if(bounds(pos, position)){
		gl_FragColor = vec4(0.3,0,0,1);	
	}
}