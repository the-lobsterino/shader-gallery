#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float g = normalize(dot( (gl_FragCoord.x * gl_FragCoord.y) , (gl_FragCoord.x / gl_FragCoord.y)));
	
	gl_FragColor =vec4(1.0,cos(time),sin(time),1.0)* normalize(dot(vec4(0.0,sin(time),g,1.0),vec4(0.0,1.0,1.0,1.0))) *sin((gl_FragCoord.y/ resolution.y ) * 90.0 + (gl_FragCoord.x / resolution.y + 10.0) );

}