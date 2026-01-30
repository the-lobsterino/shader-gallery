// Edit of Fixed Mandelbrot set with visible sequence of points in complex plane (starting at mouse position)
// Original By blogoben, visit blogoben.wordpress.com
#ifdef GL_ES
precision highp float;
#endif

//0 = mandelbrot
//1 = julia
//2 = both with orbits

// Global uniform variables set by sandbox
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

// Max iterations
const int maxIter = 300;

// Divergence radius
const float maxRadius = 2.2;

// Translation applied to device coords;
vec2 translation = vec2(-0.68, -0.5);

// Scale factor vector
vec2 scale = vec2(3.0, 2.0);

#define mandelScale 1.0
const vec3 mandelColor1 = vec3(0.0,0.0,0.0);
const vec3 mandelColor2 = vec3(0.0,0.0,1.0);
const vec3 mandelColor3 = vec3(0.0,1.0,1.0);
const vec3 mandelColor4 = vec3(0.0,0.0,1.0);
#define juliaScale 1.0
const vec3 juliaColor1 = vec3(0.0,0.0,0.0);
const vec3 juliaColor2 = vec3(1.0,0.0,0.0);
const vec3 juliaColor3 = vec3(1.0,1.0,0.0);
const vec3 juliaColor4 = vec3(1.0,0.0,0.0);
void main ()
{
	
	// By default returns black
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	
	// Determines first position
	vec2 pos = (gl_FragCoord.xy/resolution+translation)*scale;
	
	// Initialization of temporary variables
	vec2 z = vec2(0.0);
	
	// Second Mandelbrot loop at mouse position (same result for all points)
	vec2 posm = (mouse+translation)*scale;
	
	// Julia loop, same as Mandelbrot with z0 depending on current pos,
	//    c equal to mouse position
	vec2 julScale = vec2(3.0);
	vec2 julTrans = vec2(-0.5);
	pos = (pos/scale-translation+julTrans)*julScale;
	z = pos;
	for(int i=0; i<maxIter; i++)
	{
			vec2 oz = z;
			z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + posm;
			if(length(z)>maxRadius)
			{
				float f = float(i)/float(maxIter)*3.0;
				float x = fract(f);
				int i = int(f-x);
				vec3 color;
				if(i<1)
					color += mix(juliaColor1, juliaColor2, x);
				else if(i<2)
					color += mix(juliaColor2, juliaColor3, x);
				else if(i<3)
					color += mix(juliaColor3, juliaColor4, x);
				else if(i<4)
					color += mix(juliaColor4, juliaColor1, x);
				gl_FragColor.rgb += color/juliaScale;
				break;
			}		
	}
	
	
	
	// Traces circle max radius
	if(length(pos)>maxRadius)
		gl_FragColor.g += 0.04;
	
	
}