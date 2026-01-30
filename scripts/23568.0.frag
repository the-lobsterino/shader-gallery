#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D bb;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x *= (resolution.x/resolution.y);
	vec2 mews = mouse;
	mews.x *=(resolution.x/resolution.y);
	vec4 color = texture2D(bb,( gl_FragCoord.xy / resolution.xy ))+0.3 - length(mews-uv);
	gl_FragColor = color;

}