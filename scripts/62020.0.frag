#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float aspectRatio = resolution.x / resolution.y;
float zoom = 3.0;

vec3 light = vec3(10,10,10);

float r = 0.8;

void main( void ) {

	vec2 coords = (gl_FragCoord.xy / resolution - vec2(0.5, 0.5)) * vec2(aspectRatio, 1) * zoom;
	vec4 color;

	light.z = sin(time) * 10.0;
	light.x = cos(time) * 10.0;
	light.z = sin(time) * 10.0;
	
	if (coords.x * coords.x + coords.y * coords.y <= r)
	{
		
		float distanceFromCenter = sqrt(coords.x * coords.x + coords.y * coords.y);
		
		float z = sqrt( r * r - ( coords.x * coords.x + coords.y * coords.y ) );
		
		vec3 point = vec3(coords.x, coords.y, z);
		
		float f = dot(point, light);
		
		f /= 10.0;
		
		color = vec4(f, f, f, 1);
	}
	
	gl_FragColor = color;

}