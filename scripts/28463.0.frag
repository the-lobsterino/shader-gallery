#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	vec3 color;
	color.x = .0 ;//tan( sin((gl_FragCoord.x / time) * (gl_FragCoord.y / resolution.y)) );
	color.y = tan(time) / tan(gl_FragCoord.x) *( (gl_FragCoord.x  / resolution.x) * 0.3141592);
	color.z = cos(time) / gl_FragCoord.y;

	gl_FragColor = vec4( color, 1.0 );

}