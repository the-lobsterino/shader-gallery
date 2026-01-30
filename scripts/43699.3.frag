#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float lineize (float value, float nLines)
{
	float frac = value * nLines;
	float nLinesDiv = 1.0 / nLines; 
	float lines = ceil(frac) * nLinesDiv;
	return lines;
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	pos = ( gl_FragCoord.xy / resolution.x );

	float sint = sin(time * 0.5) + 4.0;
	float asint = abs(sint);
	
	float center = 0.25;
	
	float distToCenter = center - pos.y;
	float maxDtoC = max(0.0,distToCenter);	
	float nLines = 20.0 * asint;
	
	float frac = maxDtoC * nLines;
	float lines = lineize(maxDtoC,nLines) * 8.0;	
	float f = lines; 
	
	
	vec2 moonPos = vec2(0.5,0.25);
	float moonRadius = 0.15;
	vec2 toMoon = moonPos - pos;
	float toMoonDist = length(toMoon);
	float toMoonRadiusDist = moonRadius - toMoonDist;
	
	float moon = max(toMoonRadiusDist,0.0);
	moon = lineize(moon,100.0) * 8.0;
	
	f += moon;
	
	gl_FragColor = vec4(f,f,f,f) * 0.5;

}