#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform float time;
uniform vec2 resolution;

	
void main( void ) 
{	
	//vec2 position = (gl_FragCoord.xy / resolution.y);
	vec2 position = (-resolution.xy + 2.5 * gl_FragCoord.xy) / resolution.x;  //  / resolution.y);
	float zoom = abs(sin(time / 999.3) * 11.0);
	
	//float real = (position.x - 0.5) * zoom;
	//float imaginary = (position.y - 1.0) * zoom;	
			
	//zoom = 1.5;
		
	float real = (position.x - 0.5) * zoom; //    0.5; // (position.x - 0.5) * zoom;
	float imaginary = (position.y - 0.3) * zoom; // + centre.y; // 1.5; // = (position.y - 0.5) * zoom;	
		
	float const_real = real;
	float const_imaginary = imaginary;
	float z2 = 0.0;
	int iter_count = 0;
	
	for(int iter = 0; (iter) < 15; ++iter)
	{
		float temp_real = real;
		real = (temp_real * temp_real) - (imaginary * imaginary) + const_real;
		imaginary = 2.0 * temp_real * imaginary + const_imaginary;
		z2 = real * real + imaginary * imaginary;
		iter_count = iter;
		
		if (z2 > 4.0) 
			break;
	}
	
	if (z2 < 546.0)
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	else	
		gl_FragColor = vec4(mix(vec3(0.0, 0.0, 0.2), vec3(1.0, 1.0, 1.0), fract(float(iter_count)*0.02)), 1.0);	
}	