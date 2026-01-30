#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;


varying vec2 surfacePosition;

const float PI = 3.141592653589793238463;

float circle(vec2 pos, float offset)
{
	const float w1 = 0.005;
	const float w2 = w1 + 0.005;
	float radius = 0.4;
	
	float angle = mod(atan(pos.y, pos.x), 2.0*PI);
	float dispFactor = smoothstep(0.4, 0.0, ((sin(mod(angle+offset+time*2.0, 1.0*PI)))));
	radius += sin(angle*12.0) * 0.02 * dispFactor;

	float dist = length(pos);
	return mix(1.0, 0.0, smoothstep(w1, w2, abs(dist-radius)));
}

void main( void ) {

	vec2 position = surfacePosition;
	
	vec4 cred = vec4(circle(position, 0.2), 0.0, 0.0, 1.0);
	vec4 cgreen = vec4(0.0, circle(position, 0.8), 0.0, 1.0);
	vec4 cblue = vec4(0.0, 0.0, circle(position, 1.2), 1.0);
	
	vec4 color = cred + cgreen + cblue;

	gl_FragColor = color;

}