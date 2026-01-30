//Holidayified

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec3 color = vec3(0);
	
	float angle = time;
	mat2 rotation;
	rotation[0] = vec2(cos(angle), -sin(angle));
	rotation[1] = vec2(sin(angle), cos(angle));
	
	float aspect = resolution.x/resolution.y;
	float square_side = 0.2;
	vec2 texel_position = gl_FragCoord.xy/resolution - vec2(.5);
	texel_position.x *= aspect;
	vec2 transformed_texel = rotation*texel_position;
	
	if (abs(transformed_texel.x) < square_side && abs(transformed_texel.y) < square_side)
		color = vec3(1.0);
	
	gl_FragColor.rgb = mix(vec3(1,0,0),vec3(0,1,0),color.x);
}