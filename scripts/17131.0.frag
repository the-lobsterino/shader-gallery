#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	// gl_FragCoord gives (x, y) = ([0, resolution.x], [0, resolution.y])
	vec2 pixelPos = gl_FragCoord.xy / resolution; // ([0, 1], [0, 1])	
	vec2 center = vec2(0.5, 0.5);
	// closer to the center, brighter
	vec2 pixelToCenter = center - pixelPos;
	// distance between pixel and center
	float pixelToCenterDist = length(pixelToCenter);
	// distance to circle's outer rim
	float outerRimDist = .125;
	vec2 color;
	if (pixelToCenterDist <= outerRimDist) {
	   // [0,1] color value based off of distance to center
	   float k = pixelToCenterDist / outerRimDist; 
	   color.x += k;	
	}
	gl_FragColor = vec4(vec3(color.x, color.y, 0.0), 1.0);
}