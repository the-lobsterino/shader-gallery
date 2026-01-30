#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )*4. - 5.;
	float time = time + atan(position.x, position.y)*8.;
	float color1 = 0.0;
	float color2 = 0.0;
	float color3 = 0.0;
	float equation = 0.0;
	//float size = 4.0;
	float size = 2.0 * 8.0 + sin(time/4.0) * 8.0;
	float posx = size - position.x * size * 2.0;
	float posy = size - position.y * size * 2.0;
	float moux = mouse.x - 0.5;
	float mouy = mouse.y - 0.5;
	
	//equation = tan(posx*moux*8.0/posy*mouy*8.0);
	// CHANGE AS DESIRED -------------------------------------------------
	// posx,posy,moux,mouy,time
	
	//equation = (tan(posx)+tan(posy))*0.5;
	equation = posx*posy*sin(posx-time)*sin(posy+time)/length(position);
	
	// DO NOT CHANGE
	color1 += 0.0 - equation;
	color2 += 0.0;
	color3 += equation;
	
	if (color1 > 1.0) {
		color2 += color1 - 1.0;
	};
	if (color3 > 1.0) {
		color2 += color3 - 1.0;
	};
	
	//if (resolution.x == resolution.y) {color2 = 1.0;};
	gl_FragColor = vec4( vec3( color1, color2, color3 ), 1.0 );
}