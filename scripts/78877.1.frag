precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pixelPosition = ( gl_FragCoord.xy / resolution.xy );

	gl_FragColor = vec4( pixelPosition.x, pixelPosition.y, 1.0, 1.0 );

}