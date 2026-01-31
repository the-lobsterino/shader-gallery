#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 start = vec2(0, 0);
	vec2 pos = gl_FragCoord.xy;
	float w = 0.1;

	float totalDist = distance(start, mouse);
	float distA = distance(start, pos);
	float distB = distance(pos, mouse);
	
	float potentialDist = distA + distB;
	if (potentialDist + w > totalDist && potentialDist - w < totalDist)
		gl_FragColor = vec4(1, 1, 1, 1);
	else gl_FragColor = vec4(0, 0, 0, 1);


}