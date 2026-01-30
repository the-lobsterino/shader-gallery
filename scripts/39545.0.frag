#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution; //ekrana izmers

void main( void ) {

	vec2 position = (gl_FragCoord.xy/resolution.xy) -0.3; //procentuali cik sis pikselis no ekrana kopeja izmera // 0.5 kura vieta
	float y = 0.62 * sin(mouse.y * 300.0*position.x  - 30.0*time*0.2); //dabu pakapenisku krasu pareju ar sin funkciju, lai atrak vilnosas tad pareizina ar kkadu skaitli jo lielaks joa atrak vilnojas
	y = 1.0 / (500. * abs(position.y - y));
	gl_FragColor = vec4(y  , y, y*5., 1.0);  //ka izkrasijas nosaka pareizinot pedejo paliek zilaks viss  //0.2 iepriekseja rinda smaazinot netik balatas linijas

}