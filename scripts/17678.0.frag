#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// random [0;1]
vec3 rand(vec2 n)
{
  return vec3 ( fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453),
	       fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453),
	       fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453)
	       );
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	vec3 color = rand( position.xy );

	gl_FragColor = vec4( color, 1 );

}