#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float x = (mouse.x - 0.5) * resolution.x;
	float y = (mouse.y - 0.5) * resolution.y;
	float r = sqrt(x * x + y * y);
	
	float px = gl_FragCoord.x - resolution.x / 2.0;
	float py = gl_FragCoord.y - resolution.y / 2.0;
	float dist = sqrt(px * px + py * py);

	if (dist < r)
		gl_FragColor = vec4( 1.0, 1.0, 0.0, 1.0 );
	else
		gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
}