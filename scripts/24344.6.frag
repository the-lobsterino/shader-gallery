precision mediump float;

varying vec2 surfacePosition;
uniform vec2 mouse;
uniform vec2 resolution;

float ratio = resolution.x/resolution.y;

void main( void ) {
	vec2 p = mouse - vec2(.5,.5); p.x *= ratio;
	float dist = distance( p, surfacePosition );
	float heat = .1 / dist;
	
	gl_FragColor = vec4(heat,heat,heat,  1.);
}