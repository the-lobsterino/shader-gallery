#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float sun = distance(position,vec2(.5))*-5.+1.;

	gl_FragColor = vec4(vec3(5./sun,3.-sun/2.,7),5.);
		
}