#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.yy );

	float cx = 1.0 - position.x;
	float cy = position.y;
	float c = cx *cx + cy*cy;
	float f = 0.02;
	float v = smoothstep(1.0-2.0*f, 1.0-f, c);
	v *= 1.0-smoothstep(1.0-f, 1.0, c);
	v /= 1.0 - f;
	
	gl_FragColor = vec4(v, v, v, 1.0);

}