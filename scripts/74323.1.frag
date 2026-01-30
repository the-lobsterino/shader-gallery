#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float scale  = min(resolution.x, resolution.y);
	float aspect = resolution.x / resolution.y;
	vec2 tmp = vec2(gl_FragCoord.x, gl_FragCoord.y);
	vec2 position = ( tmp / scale )-vec2(1.0, 0.5);
	vec3 color = vec3(0,0,0);
	
	vec2 c = vec2(0.0, 0.0);
	if(max(0.01 - abs(length(position - c) - 0.5),0.0) > 0.0) color = vec3(1);

	gl_FragColor = vec4(color, 1.0 );

}