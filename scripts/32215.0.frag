#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	
	//position.y = clamp( position.y - 0.2, 0.0, 1.0 );
	
	float yDiffer = sin( time + position.x ) * 0.1; 
	float xDiffer = sin( time + position.y ) * 0.01;
	float yellowMultiplier = position.y > 0.4 + yDiffer ? 1.0 : 0.0;
	yellowMultiplier = position.y > 0.6 + yDiffer ? 0.0 : yellowMultiplier;
	
	float yellowMul2 = position.x > 0.2 + xDiffer ? 1.0 : 0.0;
	yellowMul2 = position.x > 0.33 + xDiffer? 0.0 : yellowMul2;
	
	yellowMultiplier = yellowMultiplier + yellowMul2;
	
	float colorB = 1.0 + yellowMultiplier;
	float colorR = 1.0 - yellowMultiplier;
	float colorG = 1.0 - yellowMultiplier;
	
	
		
	gl_FragColor = vec4( colorR, colorG, colorB, 0.0 );
}