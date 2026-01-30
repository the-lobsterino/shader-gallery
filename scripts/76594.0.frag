#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	

	float scale = 10.0;
	vec2 scaled_position = position * scale;
	
	float x = sin(scaled_position.x);
	float y = cos(scaled_position.y);
	
	float d = abs(x-y);
	
	float color = 5.0 * (1.0 - d) * d;
	
	
	color = mix(0.5, clamp(0.0, 2.0, sin(0.1*time)+color), 2.*(x+y));
	
	
	float l = length(vec2(x,y));
	
	float b = 0.0;
	if(l < 0.2) {
		b = 1.0;
	}
	
	vec3 col;
	col.x = color;
	col.y = abs(sin(0.5-color));
	col.z = mix(0.3, color, y);
	
	gl_FragColor = vec4(col, 1.0 );

}