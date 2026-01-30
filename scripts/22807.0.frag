// Original: http://glslsandbox.com/e#22802.0
// Now without if statements. Using ternary like a cool kid.

// Original: http://glslsandbox.com/e#22802.1
// Aye, ternary is cool :) 
// although using ternary to return 0.0 or 1.0 according to a>b is *perhaps* better accomplished
// using step(a,b): 
// for && you multiply results
// for || you add results (and clamp x to [0.0,1.0] or even better step(0.5,x) once more)
// for !x you subtract x from 1.0 (helps if x was already clamped)
// it's almost certainly harder to read than bools but since it's all float, it's probably faster
// for all i know some glsl compiler does it that way already
// but i ran into a bug once where this would only work if i fudged the input some

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float triWave(float t) {
	return abs(mod(t / 2.0, 2.0) - 1.0)-0.5;
}

float inRange(float x, float a, float b) {
	return step(0.5, (step(a,x) * step(x,b) +
			  step(b,x) * step(x,a)));
}

float inVectorRange(vec2 p, vec2 center, vec2 halfsize) {
	return inRange(p.x, center.x - halfsize.x, center.x + halfsize.x) *
	       inRange(p.y, center.y - halfsize.y, center.y + halfsize.y);
}

void main( void ) {
	float ballSize = 0.025;
	float ballRange = 0.8;
	vec2 paddleSize = vec2(0.0125, 0.1);

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 0.5);
	position.x *= resolution.x / resolution.y;
	
	vec2 ballPos = vec2(triWave(time)*ballRange, triWave(time*0.725)*(1.0 - ballSize));
	
	float inter1 = 1.0 - (ballPos.x/ballRange + 0.5);
	vec2 paddle1 = vec2(-0.45 + ballSize, clamp(mix(0.0, ballPos.y, 0.25 + 0.75 * inter1), -0.5 + paddleSize.y, 0.5 - paddleSize.y));
	
	float inter2 = ballPos.x/ballRange + 0.5;
	vec2 paddle2 = vec2(0.45 - ballSize, clamp(mix(0.0, ballPos.y, 0.25 + 0.75 * inter2), -0.5 + paddleSize.y, 0.5 - paddleSize.y));

	float color = 0.0;
	color = step(0.5,
		step(length(position - ballPos), ballSize) +
		inVectorRange(position, paddle1, paddleSize) +
		inVectorRange(position, paddle2, paddleSize));

	gl_FragColor = vec4( color, color, color, 1.0 );				

}