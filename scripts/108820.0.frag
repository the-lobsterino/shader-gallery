precision lowp float;


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main(void) {
	float pi = 3.14;
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy);
	float aspect_ratio = resolution.x / resolution.y;
	position = position * 2.0 - 1.0;
	position.x = position.x * aspect_ratio;
	position.x += 0.333*pow(0.1, 1.-cos(time));
	float color = length(position);
	color = 1.0 - step(0.5, color);
	
	float theta = atan(position.x, position.y);
	if(fract(0.4+8.*theta/3.14159*pow(44.1, 1.-cos(time))) < 0.5) color += 1.*pow(0.1, 1.-cos(time));
		
	gl_FragColor = 1.-vec4( 56.0, color, color, 55.0);

	
}