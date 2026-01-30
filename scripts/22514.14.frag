
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
#define ITERATIONS 120


void main( void ) {
	
	float darkness = 0.7;        // linear scale to lower brightness
	float inc_brightness = 0.27; // exp increase brightness
	
	float luma = 0.;            // the luma value of the color         
	vec3 color = vec3(luma,luma,luma);
	vec2 p_pos = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	p_pos.x *= (resolution.x / resolution.y);
	int n = 10;
	
	
	//  i < ITERATIONS is the amount of particles
	
	for(int i = 0; i < ITERATIONS; i++){
		
		// each particles position is determined by phase of a sin function
		// equally space 180 degrees by the amount of particles
		// the distance between the phase of each particle is scaled with the mouse x position  (phase width)
		
		float phase_x = mouse.x * 180.0 * float(i)/float(ITERATIONS);
		float phase_y = mouse.y * 180.0 * float(i)/float(ITERATIONS);
		
		// Time increases the phase but not its width
		// The vertical axis has been divided into the number of particles
		
		//vec2 pos = vec2(sin( time + phase_x), float(i)/float(ITERATIONS) * 2.0 - 1.0);
		vec2 pos = vec2(sin( time + phase_x), (mouse.y * 2.) * (float(i)/float(ITERATIONS) * 2.0 - 1.0));
		
		
		// this part determines the Colour value of each pixel 
		// based on the distance from pos which is the position of the particle (i) 
		
		vec2 diff = abs(pos - p_pos);
		float dist = sqrt(diff.x * diff.x + diff.y * diff.y);

		// distance to the power of the scaling value
		// most extreme distance should be blackand not white hence darkness cutoff point - colour
		// sum the colour values or the last iteration will overwrite the value for each pixel
		
		
		
		
		luma += max(0.0,(darkness - pow(dist,inc_brightness))) ; 
		
	
	}
		
	// reverse the colors for a kind of trippy effect, or don't
	// please note:  sin and cos functions vary between -1 and 1  - th negative values justgive us darkness
	
	color = (1. - luma) * vec3(min(1., 0.5 + (0.5 * (p_pos.y + sin(time * 1.5)))) , min(0.8, 0.2 + (0.6 * (p_pos.x + cos(time * 3.)))) ,  0.4 + (0.6 * sin(time + 100.)) );
	//color = (luma) * vec3(min(1., 0.5 + (0.5 * (p_pos.y + sin(time * 1.5)))) , min(0.8, 0.2 + (0.6 * (p_pos.x + cos(time * 3.)))) ,  0.4 + (0.6 * sin(time + 100.)) );
	
	gl_FragColor = vec4(color, 1.0 );

}