#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 position;

vec3 ball(vec3 colour, float sizec, float xc, float yc){
	return colour * (sizec / distance(position, vec2(xc, yc)));
}

vec3 red = vec3(2, 1, 1);
vec3 green = vec3(1, 2, 1);
vec3 blue = vec3(1, 1, 2);
void main( void ) {

	position = ( gl_FragCoord.xy / resolution.xy );
	position.y = position.y * resolution.y/resolution.x + 0.25;
	vec2 mousepos = mouse;
	mousepos.y = mouse.y * resolution.y/resolution.x + 0.25;
	
	vec3 color = vec3(0.0);
	float ratio = resolution.x / resolution.y;
	color += ball(red, mousepos.x / 10.0, mousepos.x - 0.2, cos(time*4.0) / 6.0 + 0.5);
	color += ball(green, 0.01 / mousepos.x, mousepos.x + 0.2, cos(time*4.0) / 12.0 + 0.5);
	color += ball(blue, 0.01, mousepos.x, mousepos.y);
	gl_FragColor = vec4(color, 1.0 );

}