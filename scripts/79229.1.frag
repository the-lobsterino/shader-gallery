#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const int points = 100;


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	
	vec2 A = vec2(0,0);
	vec2 B = mouse;
	vec2 C = vec2(1,1);

	vec2 largest = vec2(0, 0);
	float brightness = 0.0;
	
	for (int i = 0; i < points; i++) {
		float up = float(i)/float(points);
		float down = 1.0 - up;
		
		vec2 P = (1.0 * A * down * down +
			  2.0 * B * up * down +
			  1.0 * C * up * up);
		float error = abs(distance(position, P));
		brightness += 1.0/(error*10.0*float(points));
	}

	gl_FragColor = vec4(brightness * vec3(1.0, 1.0, 1.0), 1.0 );

}