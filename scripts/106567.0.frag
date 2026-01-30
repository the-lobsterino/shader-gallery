#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 px;
	
	px.x = sin(2.0-position.y*7.0*time);
	px.y = cos(0.3+position.y*1.75*time);
	px.z = sin(position.y*1.75*time);
	
	gl_FragColor = vec4( px.x, px.z, px.y, 1.0 );

}