#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 light = vec3(pow(1.0-abs(position.y+cos(position.x*4.5+(time*0.5))/10.0-0.55),50.0),
			  pow(1.0-abs(position.y-cos(position.x*3.0+(time*0.6))/10.0-0.5),50.0),
			  pow(1.0-abs(position.y+cos(position.x*2.5+(time*0.5))/10.0-0.45),50.0));
	light += pow(light.r+light.g+light.b,3.0);
	light *= vec3(0.5, 0.0, 0.0);
	
	gl_FragColor = vec4( light.r,light.g,light.b, 2.0 );
}