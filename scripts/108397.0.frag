#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.y );

	vec2 diff = position - vec2(0.5, 0.5);
	float dist = sqrt(diff.x * diff.x + diff.y * diff.y);
	vec3 color = vec3(1.0, 8.0, 0.0) * float(dist < (0.21 + sin(position.y * time) * 0.01 + cos(position.x * 30.0) * 0.01) && dist > 0.15);

	gl_FragColor = vec4(color, 1.0);

}