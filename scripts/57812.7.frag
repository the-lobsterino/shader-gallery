// Modified so it doesn't really move. Very childish and easy fix.
#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 resolution;
uniform float time;

uniform vec2 mouse;

// More points of color.
const float fluid_speed		= 300.0;	// Drives speed, higher number will make it slower.
const float color_intensity	= 0.8;	// Saturation of colors
const int fidelity		= 30;	// Higher number reduces blurriness
const float zoom		= 1.5;	// Does exactly what you'd expect
const float wacky		= 0.3;	// I have no fucking clue
const float weird		= 0.9;	// See wacky

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main()
{
	vec2 p = (zoom * gl_FragCoord.xy - resolution) / max(resolution.x, resolution.y);
	
	for(int i=1; i<fidelity; i++)
  	{
		vec2 newp = p + time * 0.00001;
		newp.x += weird / float(i) * sin(float(i) * p.y + time / fluid_speed + 0.3 * float(i)) + wacky;
		newp.y += weird / float(i) * sin(float(i) * p.x + time / fluid_speed + 0.3 * float(i + 5)) - wacky;
		p=newp;
	}


	vec3 col = vec3(
		(sin(p.x) * color_intensity + color_intensity) * 0.7,
		0.0,
		0.0
	);
	
	gl_FragColor=vec4(col, 1.0);
}