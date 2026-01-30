#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy ;
	vec3 color;

	//float y = (sin(position.x*1000.0 + time)/2.0+0.5);
	
	float t = step(mouse.x, position.x) * (1.0 - step(mouse.x+0.004, position.x));
	float t2 = step(mouse.y, position.y) * (1.0 - step(mouse.y+0.004, position.y));
	float rad = 0.2;
	float uDistance =  distance(position, mouse);
	float circle = step(rad, dot(uDistance, uDistance));
	
	color = vec3(t+t2+circle);

	gl_FragColor = vec4(color,1.0);

}