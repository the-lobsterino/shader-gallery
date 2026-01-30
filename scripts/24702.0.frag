#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co)
{
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float n = rand(vec2(position.x * time, position.y * time)); 
	gl_FragColor = vec4(vec3(n), 1.0);

}