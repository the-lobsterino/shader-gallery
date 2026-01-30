#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 light = vec3(pow(1.0-abs(position.y+cos(position.x*-4.0+time)/10.0-0.5),50.0),
			  pow(1.0-abs(position.y-cos(position.x* 4.0+time)/10.0-0.5),50.0),
			  pow(1.0-abs(position.y+cos(position.x* 4.0+time)/10.0-0.5),50.0));
	light -= pow(light.r+light.g+light.b,1.0);
	gl_FragColor = vec4( light.r,light.g,light.b, 1.0);
}