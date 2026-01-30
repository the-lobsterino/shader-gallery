#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	//vec2 position = gl_FragCoord.xy ;
	vec2 center = resolution.xy * .5;
	float radius = 0.15 * resolution.x;
	vec2 position = gl_FragCoord.xy - center;
	
	float z = sqrt(radius * radius - position.x * position.x - position.y * position.y);
	vec3 normal = normalize(vec3(position, z));
	vec3 cLight = vec3(1,1,1);
	float color = clamp(dot(normal, cLight), -1.0, 1.0);
	gl_FragColor = vec4(vec3(color)*sin(time),1);

}