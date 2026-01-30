#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	// Pixel position from [0, 1] on both x and y
	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	
	// Aspect ratio correction
	float aspect = resolution.x / resolution.y;
	pos.x *= aspect;
	//pos.y /= aspect;
	
	// Default color of black
	// graphics cards use float colors (range [0,1])  instead of byte colors (range [0,255])
	vec4 color = vec4(0,0,0,1);
	color.r = pos.x;
	color.g = pos.y;
	
	vec2 circleCenter = vec2(.3,.3);
	float dist = length(pos - circleCenter);
	if (dist < .2) {
		color.b = 1.0;
	}
	
	
	
	
	// actually output color- this is the way this specific environment is expected to set the pixel color 
	gl_FragColor = color;
}