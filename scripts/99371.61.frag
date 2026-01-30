//The Fastest Random Noise Shader In GLSL Sandbox History

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 i) {
    return fract(sin(dot(i.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 pos = vec2(((cos(position.x)) - (sin(position.y)))*time);
	vec3 col = vec3(rand(pos));

	gl_FragColor = vec4(col, 1.0);

}