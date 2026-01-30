#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	float lP = abs(sin(time));
	float lP2 = abs(sin(time*1.5));
	float d = abs(pow(distance(position.y, lP),0.4));
	d += abs(pow(distance(position.y, lP2),0.4));
	vec3 colorV = vec3(d,d,d);


	gl_FragColor = vec4(colorV, 1.0);

}