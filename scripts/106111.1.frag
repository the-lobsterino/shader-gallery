#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float PI = 3.14159265;

float ratio = resolution.x / resolution.y;
float stroke_size = 0.01;


float circle(float radius, vec2 xy) {
	vec2 center = vec2(0.5);
	
	if (resolution.x > resolution.y) {
	  xy.x *= ratio;
	  center.x *= ratio;
		
	} else {
	  xy.y /= ratio;
          center.y /= ratio;
	}


	float outer = step(radius, distance(xy, center));
	float inner = step(radius + stroke_size, distance(xy, center));

	return outer - inner;
}


void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	

	float radius = 0.3;
	
	pos.x += cos(time * pos.y) / PI * 0.5;
	
	float r = circle(radius, pos) * mix(cos(pos.x), sin(pos.x), cos(pos.y));
	float g = circle(radius, pos) * mix(r, sin(pos.x), cos(pos.y));
	float b = circle(radius, pos) * mix(r, sin(pos.y), cos(pos.x));

	
	vec3 color = vec3(r, g, b);
	

	gl_FragColor = vec4(color, 1.0);

}