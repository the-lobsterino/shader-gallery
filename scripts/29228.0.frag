#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 perpendicular(vec3 inp){
	return cross(vec3(0,1,0),inp);	
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	vec3 a = normalize(vec3(1,4,6));
	color = abs(dot(a, perpendicular(a)));
	
	gl_FragColor = vec4( vec3( color), 1.0 );

}