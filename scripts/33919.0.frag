#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = 2.*(( gl_FragCoord.xy / resolution.xy )-0.5);
	position.x = position.x*resolution.x/resolution.y;
	float radius = 1.;
	float z = sqrt(radius*radius - position.x*position.x - position.y*position.y);
vec3 normal = normalize(vec3(position.x, position.y, z));
vec3 cLight = normalize(vec3(0.5, 0.9, 1.0));
float diffuse = max(0., dot(normal, cLight));

	float color = dot(position,vec2(1.,1.));
	gl_FragColor =  pow(diffuse,1.)*vec4(1.,0.5,0,1.);	
}