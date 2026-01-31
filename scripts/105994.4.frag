#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// My first shader. Not really that good, but we all gotta start somewhere!
// Shader by Cian
// Probably the first real shader on this website lol

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + time/8.0; // Declaring the Position Variable

	float color = 0.0;
	color += abs(floor(sin(position.x * 160.0 + sin(floor(position.y * 20.0 )/20.0 + time) * 40.0) + cos( position.y * 80.0 + cos(floor(position.x * 40.0)/20.0 + time) * 40.0))); // Here's where the actual shader starts

	gl_FragColor = vec4( vec3(color, color*0.5, 0), 1.0 ); // Display the shader on the screen

} 

// i had no prior knowledge of glsl before this project lol