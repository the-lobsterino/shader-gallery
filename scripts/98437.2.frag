#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec3 color = vec3(0.,0.,0.);

	float yscale = 0.5;
	float yoffset = 0.5;
	float linethickness = 1./20.;
	float thickness_slope_compensation = 0.3;
	float wave_freq = 140.;
	float freq_diff = -20.;

	float xscale = 1.0;

	position.x = position.x*xscale;
	float dx = 0.001;
	float waver = 0.25*sin(position.x*wave_freq + time) + 0.25*sin(position.x*(wave_freq + freq_diff) - time);
	float wavershift = (0.25*sin(position.x*wave_freq + dx + time) + 0.25*sin(position.x*(wave_freq + freq_diff) + dx - time)); 
	float wavdiff = (wavershift - waver)/dx;
	
	float compensated_thickness = pow(abs(wavdiff),thickness_slope_compensation) * linethickness;
	
	if (compensated_thickness < linethickness/2.0)
	{
		compensated_thickness = linethickness/4.0;
	}
	
	if (abs((position.y - yoffset)/yscale - waver) < compensated_thickness)
	{
		color = color + 0.5 + 0.5*sin(4.*time*vec3(0.4,0.2,0.3) + position.x*5.);
		color = color*(0.5 + 0.5*sin(vec3(0.03,1.4,3.2)*time) + vec3(0.2,0.4,0.3));
		//color = color*(compensated_thickness - (abs((position.y - yoffset)/yscale - waver)))/compensated_thickness;
	}
	
		if (abs((position.y - yoffset)/yscale + 0.8) < compensated_thickness)
	{
		color = color + 0.5 + 0.5*sin(4.*time*vec3(0.4,0.2,0.3) + position.x*5.);
		color = color*(0.5 + 0.5*sin(vec3(0.03,1.4,3.2)*time) + vec3(0.2,0.4,0.3));
		//color = color*(compensated_thickness - (abs((position.y - yoffset)/yscale - waver)))/compensated_thickness;
	}
	
	gl_FragColor = vec4( color, 1.0 );

}