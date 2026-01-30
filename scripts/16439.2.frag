#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define pi 3.14159265
#define SPEED 1.0

float frequencyChange =  .001;
float frequencyChangeChange = .1;
float frequencyR = 0.0;
float frequencyG = 0.0;
float frequencyB = 0.0;

void main()
{
	float x = gl_FragCoord.x;
	float y = gl_FragCoord.y;
	frequencyChange = frequencyChangeChange * (50000.0 * (y + (mouse.x/200.0 * time)/200.0)) + frequencyChangeChange * (x / resolution.x);
	frequencyR += frequencyChange / 1920.0;
	frequencyG += frequencyChange / 1920.0;
	frequencyB += frequencyChange / 1920.0;
  	float r = (sin(frequencyR*(x + 1000.0)) + 1.0) / 2.0;
	float g = (sin(frequencyG*(x + 1007.0) + 3.7*pi/3.0) + 1.0) / 2.0;
	float b = (sin(frequencyB*(x + 1013.0) + 3.3*pi/3.0) + 1.0) / 2.0;
	gl_FragColor = vec4(r, g, b, 1.0);
}
