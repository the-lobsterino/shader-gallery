#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
	// Sets the position of the circle
	vec2 uv = gl_FragCoord.xy/resolution.xy * 2.0 - 1.0;
	float aspect = resolution.x / resolution.y;
	// Aspect ratio multiplication
	uv.x *= aspect;
	
	// Thickness of the sphere; set this to 1.0 if you want a filled circle 
	float thickness = 0.05;
	
	// Change this "1.0" to the size you want the circle to be
	float distance = 1.0 - length(uv);
	// You could try smoothstepping this, but I didn't bother with it
	vec3 col = vec3(step(0.0, distance));
	col *= vec3(1.0 - step(thickness, distance));
	
	// Set the sphere's color
	gl_FragColor.rgb = col * vec3(0.65, 0.52, 1.0);
	gl_FragColor.a = 1.0;
}