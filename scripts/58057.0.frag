#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {
	//normaized cords form -1 to 1
	vec2 p = (gl_FragCoord.xy - .5*resolution.xy )/resolution.y;
	//polar cordinates
	vec2 pc = vec2(atan(p.x, p.y), length(p));
	
	float c = smoothstep(0., 2., sin((pc.x-pc.y)*8.));

	gl_FragColor = vec4( vec3(c), 1.0 );

}