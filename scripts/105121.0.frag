#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy - resolution.xy/2. )/resolution.y;

	float sun = distance(position,vec2(.0))*-5.+1.;

	gl_FragColor = vec4(vec3(1./sun,1.-sun/2.,0),1.);
		
}