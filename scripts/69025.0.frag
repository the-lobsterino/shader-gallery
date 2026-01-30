#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec3 color = vec3( 0.10, 0.54, 0.9);
	
	vec2 uzunluk = vec2(mouse.y, 0.1);
	
	float merkezX = 0.5 + sin(time * 0.2) * 0.2;
	float merkezY = 0.5 + sin(time * 0.2) * 0.2;
	
	// Fareyle birlikte hareket
	// float merkezX = mouse.x;
	// float merkezY = mouse.y;
	
	if(position.x > merkezX - uzunluk.x
	   && position.x < merkezX + uzunluk.x
	   && position.y <  merkezY + uzunluk.y
	   && position.y > merkezY - uzunluk.y) {
		color.xy = uzunluk + mouse;
		color.z = sin(time * 0.2);
	}

	gl_FragColor = vec4( color, 1.0 );

}