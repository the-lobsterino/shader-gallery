#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

vec2 position;

vec3 ball(vec3 colour, float sizec, float xc, float yc){
	return colour * (sizec / distance(position, vec2(xc, yc)));
}

vec3 grid(vec3 colour, float linesize, float xc, float yc){
	float xmod = mod(position.x, xc);
	float ymod = mod(position.y, yc);
	return xmod < linesize || ymod < linesize ? vec3(0) : colour;
}

vec3 circle(vec3 colour, float size, float linesize, float xc, float yc){
	float dist = distance(position, vec2(xc, yc));
	return colour * clamp(-(abs(dist - size)*linesize * 50.0) + 0.5, 0.1, 1.0);
}

vec3 red = vec3(2, 1, 1);
vec3 green = vec3(1, 2, 1);
vec3 blue = vec3(1, 1, 2);
void main( void ) {

	position = ( gl_FragCoord.xy / resolution.xy );
	position.y = position.y * resolution.y/resolution.x + 0.25;
	
	vec3 color = vec3(0.0);
	float ratio = resolution.x / resolution.y;
	color += circle(blue, 0.085, 0.6, 0.5, 0.5);
	
	//color += grid(blue * 0.1, 0.001, 0.06, 0.06);
	
	color *= 1.0 - distance(position, vec2(0.5, 0.5));
	float speed = 10.0;
	
	vec3 balls = blue;
	balls *= ball(vec3(1.0), 0.02, sin(time*speed) / 12.0 + 0.5, cos(time*speed) / 12.0 + 0.5) + 0.5;
	balls *= ball(vec3(1.0), 0.02, -sin(time*speed) / 12.0 + 0.5, -cos(time*speed) / 12.0 + 0.5) + 0.5;
	balls *= ball(vec3(1.0), 0.02, sin(time*speed + 1.57) / 12.0 + 0.5, cos(time*speed + 1.57) / 12.0 + 0.5) + 0.5;
	balls *= ball(vec3(1.0), 0.02, -sin(time*speed + 1.57) / 12.0 + 0.5, -cos(time*speed + 1.57) / 12.0 + 0.5) + 0.5;
	
	color *= balls;
	
	gl_FragColor = vec4(color, 1.0 );
}