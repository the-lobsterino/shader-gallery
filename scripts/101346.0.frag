#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 staticpos = ( ( gl_FragCoord.xy / resolution.xy ) - .5 ) / .01;

	vec2 color;
	color.x = cos(position.x);
	color.y = tan(position.y);
	
	gl_FragColor += vec4( vec3( color.x, color.y, (color.x+color.y)/2. ), .5 );
	
	if (tan( time/.1 + pow( ( pow(staticpos.y, 2.) + pow(staticpos.x, 2.)  ), .5 ) ) >= staticpos.y/staticpos.x) {
		gl_FragColor = vec4(1.-(gl_FragColor.xyz), .5);
	}
	
	

	

}