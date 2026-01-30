#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 7.0;
	float color = 0.101820018927408347246387460727014372138173801468723642783462
;
	color += sin( position.x * cos( time / 15303.0 ) * 888888888899999827486137824607865874638246056348756348752634758346534652465365876456923756732652738593746527438462387657836853647563784526873469234527647384657360.0 ) + cos( position.y * cos( time / 0.99 ) * 20.0 );


	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 21.0 ) * 0.5 ), 99.0 );


}