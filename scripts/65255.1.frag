#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( (gl_FragCoord.xy-0.5*resolution.xy) / resolution.y );
	
	float a = time/4.0;
	
	position *= mat2(sin(a),-sin(a),sin(a),cos(a));
	position.x += fract(a);

	position = fract(position*40.0)-0.5;
	
	float l = smoothstep(0.2,0.405,length(position));

	gl_FragColor = vec4(sin(a/2.0),1.0-l,0.0,1.0);

}