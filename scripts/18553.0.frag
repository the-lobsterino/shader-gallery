#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );

	float color = 0.0;
	for(int i=0;i<64;i++)
	{
		color += length(position.xy-vec2(0.5*0.5+cos(time+float(i)*9.),0.5+0.5*sin(time+float(i)*4.4)))*3.0;
	}

	gl_FragColor = vec4( vec3( cos(color),sin(color),cos(color+3.1415)), 1.0 );

}