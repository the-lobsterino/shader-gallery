#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265384

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color1x = 0.0;
	float color1y = 0.0;
	
	float speed = 40.0;
	
	float A1 = 5.0 * sin(time/speed); //amplitude
	float B1x = PI * 20.0 * sin(time/speed);
	float B1y = PI * 20.0 * cos(time/speed);
	float D1 = 0.8 * sin(time/speed); //vertical shift
	
	float C1x = position.x + sin(position.x * (time/speed));
	color1x = A1 * sin(B1x * C1x)+D1;
	
	float C1y = position.y + cos(position.y * (time/speed));
	color1y = A1 * sin(B1y * C1y)+D1;
	
	float color1xy = (color1x + color1y)/2.0;
	color1xy *= cos(time / 5.0) * 0.5;
	
	
	float color2x = 0.0;
	float color2y = 0.0;
	
	float A2 = 5.0 * cos(time/speed);
	float B2x = PI * 15.0 * cos(time/speed);
	float B2y = PI * 15.0 * sin(time/speed);
	float D2 = 0.5 * cos(time/speed);
	
	float C2x = position.x + cos(position.x * (time/speed));
	color2x = A2 * cos(B2x * C2x)+D2;
	
	float C2y = position.y + sin(position.y * (time/speed));
	color2y = A2 * cos(B2y * C2y) + D2;
	
	float color2xy = (color2x + color2y)/2.0;
	color2xy *= sin(time / 10.0) * 0.5;
		
		
	gl_FragColor = vec4(color1xy, color2xy, (color1xy + color2xy)/2.0, 0);
	

}