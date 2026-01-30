//---------------------------------------------------------
// Shader:   IllustratedEquations.glsl               4/2015
//           http://glslsandbox.com/e#24923
//           http://glslsandbox.com/e#24891
// Original: https://www.shadertoy.com/view/MtBGDW
//           Created by sofiane benchaa - sben/2015 
// tags:     procedural, 2d, fractal, trigonometric, curve, complex, iterative
// info:     http://www.mathcurve.com/surfaces/tore/tn.shtml
//           http://xrt.wikidot.com/gallery:implicit
//---------------------------------------------------------

#ifdef GL_ES
precision mediump float; 
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//---------------------------------------------------------
#define FIELD 28.0;
#define ITERATION 12
#define CHANNEL bvec3(true,true,true)
#define PI4 0.7853981633974483
#define TONE vec3(0.299,0.587,0.814)

//just a line
float crossEQ(vec3 p,float t)
{
	float pv = 10.*p.x * p.y*2.0;
	return pv * pv;
}

//---------------------------------------------------------
vec3 computeColor(float fv)
{
	vec3 color = vec3(vec3(CHANNEL)*TONE);
	color -= (fv);
	color.r += color.r*10.5;
	color.g += color.g*10.5;
	color.b += color.b*20.0;
	return clamp(color,(0.0),(1.0));
}
//---------------------------------------------------------
void main() 
{
	float ratio = resolution.y / resolution.x;
	vec2 position = ( gl_FragCoord.xy / resolution.xy )-vec2(0.5, 0.9*ratio);
	position.y *= ratio;
	vec3 p = position.xyx*FIELD;
    	
	// gigatron, test basic loop 	
	
	// define color variable 
	vec3 color =vec3(0.,0.,0.);
	// lets loop 10 times , 
	for (float i=0.;i<10.;i+=1.)
	{
			
	      color += computeColor(crossEQ(p+vec3(i/(mouse.x*20.)*p.x, sin(time)*i, 0.0),0.0));
	}
	gl_FragColor = vec4( color, 1.0 );
}
