#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	// Transform fragcoord to viewport coord.
	vec2 coord = (gl_FragCoord.xy + gl_FragCoord.xy - resolution) / resolution.y;	
	
	// Get the radius from the length of the coordinates
	float radius = length(coord);
	
	// Should the mouth be open? ..closed? ..somewhere between?
	float mouth_opening = abs(cos(time*8.));
	
	// Paint if the fragment its inside the radius and outside the mouth
	gl_FragColor = vec4(1.0,1.0,0.0,8.0) 
			* step(radius,1.0) 
			* step(coord.x / radius,0.75+0.25*mouth_opening);	

}