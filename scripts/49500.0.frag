#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.x *= (4.0);
	position.y *= 30.0;

	vec3 color = vec3(time*position.x,cos(time*position.y)/3.0/sin(1.0),sin(time * position.x/sin(4.0)));

	gl_FragColor = vec4(sin(color * position.y),5.0);

}