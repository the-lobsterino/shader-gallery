#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float intensity = 2.0;
	float p = 1.0;
	float red = 0.1;
	float x = gl_FragCoord.x / resolution.y - 0.5;
	float y = gl_FragCoord.y / resolution.y;

	float dx = x-0.5;
	float dy = y-0.5;
	float d = sqrt(dx*dx+dy*dy);
	
	float i = intensity / pow(1.5, d / red);	
	
	gl_FragColor = vec4( i, i, i, 1.0);

}