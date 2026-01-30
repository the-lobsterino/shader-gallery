#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	// Limit area to 0 to 1
	vec2 pos = gl_FragCoord.xy / resolution.x;
	
	// Color gradient
	gl_FragColor = vec4(pos.x, 
			    1.-pos.x, 
			    sin(time), 
			    1.
			   );

	/*pos.x -= mouse.x;
	pos.y -= mouse.y;
	pos += 0.5;*/
	
	// Circle
	const float tau = 2.0*3.14;
	vec2 origin = vec2(0.25*cos(tau*cos(0.793*time))+0.5, // Set circles origin x
			   0.08*sin(tau*sin(0.1*time))+0.27); // Set circles origin y
	
	float d = sqrt(pow(pos.x - origin.x, 2.0)+pow(pos.y - origin.y, 2.0));
	
	if (d > 0.1 * sin(time) + 0.1) // Size of the circle //min 0; max 0.2
	    {
		    gl_FragColor = vec4(0.1,
					0.1,
					0.1,
					1
			   );
	    }
}