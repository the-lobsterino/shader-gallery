#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	
	float protY = sin(pos.x * 0.15 * acos(pos.y * sin(atan(time) * pos.y * pos.x)) * (time * 9999999999999999999999999999999999999999999999999000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000.0));
	
	float isVisible = step(protY, pos.y) * step (protY, 1.0 - pos.y);
	float color = isVisible * 1.0;

	float c = color * atan(time);
	gl_FragColor = vec4(sin(c), sin(c * sin(pos.x + cos(time))), sin(c * sin(pos.y + cos(time))), 1.0 );

}