#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float radiusInPixels = 128.0;
	if(length(gl_FragCoord.xy-resolution.xy*.5)<radiusInPixels)
		gl_FragColor=vec4(1);
	else
		gl_FragColor=vec4(0);
	
}