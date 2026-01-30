#ifdef GL_ES
precision mediump float;
#endif

float pi = 3.141592653589793238462643383279;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float getWaveHeight(vec2 glCoordRel)
{
	float period = (time/10.0)*glCoordRel.x;
	float amplitude = 0.01;
	float waveOffset = 1.0/3.0;
	
	//some random
	
	float addAmplitude = min(0.0, sin(period + time/2.0)/10.0) 
		+ min(0.0, cos(period + time/3.0)/10.0);
	
	vec2 wave = vec2(glCoordRel.x ,waveOffset + sin(period)*amplitude + addAmplitude);
	
	return wave.y;
}

void main( void ) {
	
	vec2 glCoordRel = gl_FragCoord.xy/resolution;
	vec4 bgcolor = vec4(0.0, 0.2, 0.3, 1.0);
	vec4 waveColor = vec4(0.3, 0.3, 1.0, 1.0);
	vec4 waveColor1 = vec4(0.0, 0.2, 0.6, 1.0);
	vec4 waveColor2 = vec4(0.0, 0.2, 0.6, 1.0);
	
	//lightwave attenuation
	
	float waveHeight = getWaveHeight(glCoordRel);
	vec4 color;
	
	
	float currentDepth = 1.0 - glCoordRel.y;
	color = mix(waveColor, bgcolor, currentDepth/waveHeight);
	float waveHeight1 = waveHeight*1.5;
	color = mix(waveColor1, color, (currentDepth - waveHeight)/(waveHeight1 - waveHeight));
	color = mix(waveColor2, color, (currentDepth - waveHeight1)/(waveHeight*2.0 - waveHeight1));
	
	gl_FragColor = color;
}