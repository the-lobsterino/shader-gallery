#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 color = vec3(position.xy,.0);
	color.xy -= 0.5;
	color.xy = abs(color.xy);
	
	color.x *= 2.6;
	color.xy = 1. - color.xy;
	float win_mask = min(color.x, color.y);
	float win_outer = smoothstep( .55, .7, win_mask );
	float win_inner = smoothstep( .7, .72, win_mask );
	win_mask = win_outer - win_inner;
	
	vec3 sky_color = vec3( .6, .9, 1. );
	color = sky_color * win_mask;
	
	position.y -= .4;
	float mountain = asin(sin(position.x*50.+time))+position.y* sin(time) * 20.;
	vec3 win_color = sky_color * clamp(mountain, 0., 1.5);
	
	if( win_inner > .0 ){
		color = win_color;
	}
	
	gl_FragColor = vec4(color, 1.);

}