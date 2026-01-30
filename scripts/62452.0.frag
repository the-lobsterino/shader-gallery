#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

#define PI 3.1415926535897932384626433832795

float world(vec3 p);

void main( void ) {
	vec3 color = vec3(0, 0, 0);

	// front	y
	// up 		z
	// right	x 
	float fov = 100.0;
	vec3 eye = normalize(vec3((gl_FragCoord.x - resolution.x * 0.5) / resolution.y, 0.5 / tan(radians(fov * 0.5)), (gl_FragCoord.y - resolution.y * 0.5 ) / resolution.y));

	vec3 origin = vec3(0, 0, 0);
	vec3 current = origin;
	for (int i = 0; i < 100; i++) {
		float dis = world(current);
		if (dis < 0.001) {
			color = vec3(1, 1, 1);
			break;	
		} else {
			current += dis * eye;
		}
	}
	
	gl_FragColor = vec4(color, 1);
}



float world(vec3 p) {
return 0.001;
}