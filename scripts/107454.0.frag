

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float pi = 3.1415;

void main( void ) {
	vec3 color = vec3 (.0);
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	color.g= step(0.0,(sin(10.0*sin(time)*log(position.y/position.x))+sin(10.0*cos(time)*log((1.0-position.y)/(1.0-position.x)))+sin(10.0*log((1.0-position.y)/(position.x)))+sin(10.0*log((position.y)/(1.0-position.x))))/4.0);
	color.r = .0-step(0.0,(sin(10.0*sin(time)*log(position.y/position.x))+sin(10.0*cos(time)*log((1.0-position.y)/(1.0-position.x)))+sin(10.0*log((1.0-position.y)/(position.x)))+sin(10.0*log((position.y)/(1.0-position.x))))/4.0);;
	color.b = .3;

	color = vec3(.0);

	
	
	gl_FragColor = vec4(color,1.0 );

}