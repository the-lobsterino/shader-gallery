#ifdef GL_ES
precision mediump float;
#endif

#define M_PI  3.14159265358
#define M_TAU 6.28318530718

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// http://www.atnf.csiro.au/computing/software/gipsy/sub/bessel.c
float bessj1(float x)
{
	float absolute_x;
	float z;
	float xx;
	float y;
	float ans;
	float ans1;
	float ans2;

	if ((absolute_x = abs(x)) < 8.0)
	{
		y = x * x;

		ans1 = x * (72362614232.0 +
			    y * (-7895059235.0 +
				 y * (242396853.1 +
				      y * (-2972611.439 +
					   y * (15704.48260 +
						y * (-30.16036606))))));
		ans2 = 144725228442.0 +
			y * (2300535178.0 +
			     y * (18583304.74 +
				  y * (99447.43394 +
				       y * (376.9991397 +
					    y * 1.0))));
		ans = ans1 / ans2;
	}
	else
	{
		z = 8.0 / absolute_x;
		y = z * z;
		xx = absolute_x - 2.356194491;

		ans1 = 1.0 +
			y * (0.183105e-2 +
			     y* (-0.3516396496e-4 +
				 y * (0.2457520174e-5 +
				      y * (-0.240337019e-6))));

		ans2 = 0.04687499995 +
			y * (-0.2002690873e-3 +
			     y * (0.8449199096e-5 +
				  y * (-0.88228987e-6 +
				       y * 0.105787412e-6)));

		ans = sqrt(0.636619772 / absolute_x)*(cos(xx)*ans1 - z*sin(xx)*ans2);
		
		if (x < 0.0)
		{
			ans = -ans;
		}
	}
	
	return ans;
}

vec3 hsv2rgb(float h, float s, float v)
{
	// https://gist.github.com/JensAyton/499357
	float hi = h * 3.0 / M_PI;  // Sector, [-3..3)
	float f = hi - floor(hi);  // Fractional part.
    
	vec4 components = vec4
	(
		0.0,
		s,
		s * f,
		s * (1.0 - f)
	);
	
	components = (1.0 - components) * v;
 
	return (hi < 0.0) ?
		(
			(hi < -2.0) ? components.xwy :
			(hi < -1.0) ? components.zxy :
			components.yxw
		) :
		(
			(hi < 1.0) ? components.yzx :
			(hi < 2.0) ? components.wyx :
			components.xyz
		);
}

void main ()
{
	// Airy Disk

	vec2 position = (gl_FragCoord.xy / resolution.xy) - vec2(0.5, 0.5);

	float magnification = 1.0;

	float radial_distance = length(position) * (1.0 / magnification);
	float angle = atan(position.y, -position.x);

	float wavelength = mouse.x;
	float distance_to_screen = mouse.y;
	float aperture = 1.0;
	float x_value = (M_TAU * aperture * radial_distance) / (wavelength * distance_to_screen);

	float fractional_intensity = pow((2.0 * bessj1(x_value)) / x_value, 2.0);

	vec3 rgb = hsv2rgb(angle, sqrt(radial_distance) * 4.0, 5.0);

	vec4 rgba = vec4(rgb, step(radial_distance, 1.0));
    
	gl_FragColor = rgba * sqrt(fractional_intensity);
}