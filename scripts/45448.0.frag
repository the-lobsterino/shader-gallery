#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	
	color += cos(position.x * time / 30.0) + cos(position.y * time / 19.0);
	color += sin(position.y * 15.0 / time) + sin(position.x * time / 15.0) * 18.0;
	color += tan(position.x * 29.0) + sin(position.y * time * 1000.0);
	color *= sin (time / position.x) * cos (position.y / time);
	gl_FragColor = vec4(vec3(color, sin(time) * color, color * 0.3) * 0.1, 1.0);}