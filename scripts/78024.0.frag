precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {
	float PI = 3.141592653;
	float rad = .75;

	// vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float y = sin(time * 9.0) * rad;
	float x = cos(time * 9.0) * rad;
	float y2 = sin(time * 9.1) * rad;
	float x2 = cos(time * 9.1) * rad;
	float y3 = sin(time * 9.2) * rad;
	float x3 = cos(time * 9.2) * rad;

	float color = 0.0;
	color += sin(x + position.x * PI * 9999999999999999999999.0) * sin(y + position.y * PI * 9999999999999999999999.0);
	float color2 = 0.0;
	color2 += sin(x2 + position.x * PI * 9999999999999999999999.0) * sin(y2 + position.y * PI * 9999999999999999999999.0);
	float color3 = 0.0;
	color3 += sin(x3 + position.x * PI * 9999999999999999999999.0) * sin(y3 + position.y * PI * 9999999999999999999999.0);

	gl_FragColor = vec4( color, color2, color3, 1.0 );

}