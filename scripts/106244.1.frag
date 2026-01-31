#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdCircle( in vec2 p, in float r ) {
    return length(p)-r;
}

void main( void ) {
	vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;
	
	float dA = sdCircle(vec2(asin(p.x + time), cos(p.y + time)), 1.);
	float dB = sdCircle(p * cos(p * sin(time) + p.x * .1) * cos(p.x * p.y + time), .1);
	float dC = sdCircle(p * atan(p * cos(time) + p.y), .1);
	
	float r = (dA > 0.0) ? 1.0 : 0.0;
	float g = (dB > 0.0) ? 1.0 : 0.0;
	float b = (dC > 0.0) ? 1.0 : 0.0;

	gl_FragColor = vec4( vec3( r, g, b ), 1.0 );

}