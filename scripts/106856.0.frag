#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D bb;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );

	vec4 color = texture2D(bb,uv)+5.-length(uv-mouse);

	gl_FragColor = color;

}