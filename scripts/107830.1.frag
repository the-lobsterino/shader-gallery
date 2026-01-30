#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(float radius, vec2 position) {
	float value = distance (position, vec2(0.0));
	return step(radius, value);
}

void main( void ) {

	// Calculate the normalized position of the fragment
	vec2 fragPos = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	
	// vec2 mousePosition = ( mouse.xy / resolution.xy ) * 2.0 - 1.0;
	// vec2 mousePosition = ( mouse / resolution ) * 2.0 - 1.0;

	
	// Define the radius and thickness of the circle
    	float radius = 0.15;  // You can adjust this value to change the size of the circle
    	float thickness = 0.01; // You can adjust this value to change the thickness of the circle

	float circle = circle(radius, fragPos);
	vec3 color = vec3(circle);
	
	// Output the color
    	gl_FragColor = vec4(color, 1.0);
}