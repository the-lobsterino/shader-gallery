#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float usin(float t){
	return (sin(t)+1.0)/2.0;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	vec3 color = vec3(usin(time*5.0), 0., 0.);
	
	gl_FragColor = vec4(color , 1.0 );

}