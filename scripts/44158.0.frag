#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	float c2 = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	
	c2 = 0.0;
	c2 += sin(position.x + cos(time * 1.0));
	c2 += sin(position.y + cos(time * (position.x * 3.0)));
	c2 = fract(c2) - color;
	
	float r = 0.0;
	float g = sin(position.y);
	
	for (int i=0;i<10;i++) {
		r += position.x - c2;
	}
	for (int i=0;i<10;i++) {
		g += position.y - c2;
	}
	
	float b = 1.0;
	float final_1 = r * b;
	float final_2 = g * b;
	float final_3 = ((r+g)/time) * b;

	gl_FragColor = vec4(final_1 / 20.0, final_2 / 2.0, final_3 / 1.0, 1 );

}

