#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float PI = 3.14159265;


float clipper (float clippee)
{
	float clipped = clippee;
	if (clippee < 0.)
	{clipped = 0.;}
	else if (clippee > 1.)
	{
		clipped = 1.;
	}
	return clipped;
}
vec3 clipper (vec3 clippee)
{
	vec3 clipped = clippee;
	for(int i = 0; i < 3; i++)
	{
		clipped[i] = clipper(clipped[i]);
	}
	return clipped;
}

vec3 hsl_rgb (float hue, float saturation, float brightness)
{
	//the original basis vectors used to create the change of basis matrix are:
	// red = vec3(sqrt(2./3.), sqrt(1./3.), 0.);
	// green = vec3(-1.sqrt(6.), sqrt(1./3.), 1./sqrt(2.));
	// blue = vec3(-1./sqrt(6.), sqrt(1./3.), -1./sqrt(2.));
	
	//values outside the cube return black.
	//TODO: clip saturation above a certain point dependent on brightness and hue
	//TODO: find largest valid value that intersects the line between (input value) and vec3(0., brightness, 0.)?
	
	vec3 color = vec3(0.,0.,0.);
	float saturationnorm = saturation*sqrt(2./3.);
	float cubex = saturationnorm*cos(hue);
	float cubey = brightness*sqrt(3.);
	float cubez = saturationnorm*sin(hue);
	vec3 inv1 = vec3(sqrt(2./3.),1./sqrt(3.),0.);
	vec3 inv2 = vec3(-1./sqrt(6.),1./sqrt(3.),1./sqrt(2.));
	vec3 inv3 = vec3(-1./sqrt(6.),1./sqrt(3.),-1./sqrt(2.));
	mat3 colmatrix = mat3(inv1, inv2, inv3); 
	color = vec3(cubex, cubey, cubez)*colmatrix;
	for (int i = 0; i < 3; i++)
	{
	if (color[i] > 1. || color[i] < 0.)
	{
		color = color - color;
	}
	}
	color = clipper(color);

	return color;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 color = vec3(0.0,0.0,0.0);
	float hue = position.x*2.*PI*2.;
	float saturation = position.y;
	float brightness = 0.5+0.5*sin(time);
	color = hsl_rgb(hue,saturation,brightness);
	
	gl_FragColor = vec4( color, 1.0 );

}