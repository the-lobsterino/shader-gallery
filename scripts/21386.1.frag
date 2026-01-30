#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = gl_FragCoord.xy;
	vec3 color = vec3(0.0);
	float angle = atan(pos.y-resolution.y/2.0, pos.x-resolution.x/2.0);
	

	color.x=sin(angle*10.0+time*1.0)*0.5+0.5;
	color.y=sin(angle*10.0+time*2.0)*0.5+0.5;
	color.z=sin(angle*10.0+time*3.0)*0.5+0.5;

			 
	gl_FragColor = vec4(color, 1.0 );

}