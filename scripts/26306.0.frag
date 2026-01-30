#ifdef GL_ES
precision mediump float;
#define M_PI 3.14159265
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float w = resolution.x;
float h = resolution.y;

vec2 center = vec2(w * 0.25, h * 0.25);

float move = w / 10.0;
float size = 25.0;
const float fnp = 16.0;

void main( void ) {		
	
	float color = 0.0;
	
	float distC = distance(gl_FragCoord.xy * .5, center); 
	color += pow(size / distC, 2.0);

	
	float osc = move * abs( sin(time));
	
	for(int i = 1; i < int(fnp); i++)
	{
		float fi=float(i);
		
		float timei = 2.0*time-fi*0.2;
		
		float osci = move * sin(timei)*step(0.0,sin(timei));
		
		float angi = 5.0*floor(timei/M_PI)+float(i)*0.4;
		vec2 posi = center + vec2( osci*sin((angi+float(i))*0.5+float(i)), osci*cos((angi+float(i))*0.5) );		
		
		float disti = length(gl_FragCoord.xy * .5 - posi);
		color += (0.03 + 0.02 *sin(time*20. + float(i))) * pow(size / disti, 2.0);
	}

	gl_FragColor = vec4(vec3(color / 4.0, color / 2.0, color / 2.0), 1.0);
}