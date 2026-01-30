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


vec3 green = vec3(1, 2, 1);
vec3 red = vec3(2, 1, 1);
vec3 blue = vec3(1, 1, 2);
void main( void ) {

	position = ( gl_FragCoord.xy / resolution.xy );
	position.y = position.y * resolution.y/resolution.x + 0.25;
	vec2 mousepos = mouse;
	mousepos.y = mouse.y * resolution.y/resolution.x + 0.25;
	
	vec3 color = vec3(0.0);
	float ratio = resolution.x / resolution.y;
	
	//float pi = 0.0;
	
	for(float i = 0.0; i < 3.14 ; i += 0.1){
		color += ball(green * max((sin(time * 1.0)+ 1.5 ) ,1.0 ) * 0.1 , 0.01, i/2.0, sin(i * time) * (0.5));
	}
	
	for(float i = 0.0; i < 3.14 ; i += 0.13){
		color += ball(red * max((sin(time * 2.0)+ 1.5 ) ,1.0 ) * 0.1 , 0.01, i/3.0, sin(i * time) * (0.5));
	}
	
	for(float i = 0.0; i < 3.14 ; i += 0.12){
		color += ball(blue * max((sin(time * 4.0)+ 1.5 ) ,1.0 ) * 0.1 , 0.01, i/3.0, (sin(i * time) * (0.5)));
	}
	gl_FragColor = vec4(color, 1.0 );

} 