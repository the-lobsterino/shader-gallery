#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );

	gl_FragColor = vec4( uv.y / uv.x, uv.x * uv.y, uv.x / uv.y, 1 );
}