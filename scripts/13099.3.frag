#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

void main( void ) {

	vec3 color;
	if (length((gl_FragCoord.xy-mouse*resolution+resolution/2.)/resolution - vec2(.5)) < .125)
		color = vec3(1);
	
	vec3 buf_color = texture2D(backbuffer, gl_FragCoord.xy/resolution).rgb;
	
	color *= 0.1;
	color += buf_color * 0.9;
	
	gl_FragColor = vec4( color, 1.0 );

}