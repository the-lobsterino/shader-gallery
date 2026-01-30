#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 coords)
{
    return fract(sin(dot(coords.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );


	gl_FragColor = vec4( vec3( rand(position) ), 1.0);
}