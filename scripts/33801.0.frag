#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//whats it for?

#define pi 3.141592653589

float sus_sin(float x)
{
	
	float output1 = sin(0.5*(x - (pi/2.)));
	float output2 = sign(output1);
	float output3 = sin(x);
	float output4 = max(output2, output3);
	
	float output5 = sign(output3) * output2;
	
	float output6 = max(output5,output3*output5);
	
	return output4;
}

float sus_sin2(float x)
{
	
	float output1 = cos(0.5*(x - (2.0*pi/2.)));
	float output2 = sign(output1);
	float output3 = cos(x);
	float output4 = max(output2, output3);
	
	
	return -output4;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	
	vec2 uv = position;
	float color1 = 0.0;
	float color2 = 0.0;
	float color3 = 0.0;
	
	

	float f, g, h = 0.;
	
	f = 0.1*cos(40.0*uv.x);
	
	
	f = 0.1*sin(40.0*uv.x);
	
	f = 0.1*sus_sin(40.0*uv.x);
	
	g = 0.1*sus_sin2(40.0*uv.x);
	
	h = 10.0*(f*g);
	
	color1 = abs(.01/((uv.y - f)-0.5));
	color2 = abs(.01/((uv.y - g)-0.5));
	color3 = abs(.01/((uv.y - h)-0.5));
	
	
	gl_FragColor = vec4( color1, color2, color3, 1.0 );

}