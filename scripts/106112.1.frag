#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float PI = 3.14159265;

float ratio = resolution.x / resolution.y;
float stroke_size = 0.3;


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
	
	pos.x += tan(time) / PI;
	
	float r = circle(radius, pos);
	
	float g = 0.4;
	float b = 0.5;
	
	vec3 color = vec3(r, g, b);

	gl_FragColor = vec4(color, 0.5);

}