#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PHI 		((sqrt(5.)+1.)*.5)
#define TAU		(8.*atan(1.))

float contour(float x, float r)
{
	return 1.-clamp(x*x*r-1., 0., 1.);
}


float edge(vec2 p, vec2 a, vec2 b)
{
	vec2 q	= b - a;	
	float u = dot(p - a, q)/dot(q, q);
	u 	= clamp(u, 0., 1.);

	return distance(p, mix(a, b, u));
}


float binary(float n, float e)
{
	return n/exp2(e+1.);
}



float gray(float n, float e)
{
	return binary(n, e+1.)+.25;
}


float q = floor(mouse.x * 6.);//xhzx
float bitmap(float n, float e)
{
	return step(.5,  fract(gray(n, e)));
}


vec3 h46cube(float i)
{
	float q = floor(mouse.x * 6.);//xhzx
	float x = bitmap(i, mod(q + 1., 6.));
	float y = bitmap(i, mod(q + 4., 6.));
	float z = bitmap(i, mod(q + 2., 6.));
	float u = bitmap(i, mod(q + 0., 6.));
	float v = bitmap(i, mod(q + 5., 6.));
	float w = bitmap(i, mod(q + 3., 6.));	

	return vec3(x * PHI - u * PHI + y + v,
		    y * PHI - v * PHI + z + w,
		    z * PHI - w * PHI + x + u)-1.;	
}

vec3 rainbow(float hue, float ratio) 
{
    return smoothstep(vec3(0.,0.,0.),vec3(1.,1.,1.),abs(mod(hue + vec3(0.,1.,2.)*(1./ratio),1.)*2.-1.));
}


void main( void ) 
{
	vec2 uv 			= gl_FragCoord.xy/resolution.xy;
	vec2 aspect			= resolution.xy/min(resolution.x, resolution.y);	

	vec2 view_layout		= vec2(128., 4.);
	vec2 index			= floor(uv * view_layout);
	vec2 mouse_index 		= floor(mouse * view_layout);

	
	vec2 p				= (fract(uv  * view_layout) - .5) * aspect;
					   
	p.x				/= sqrt(3.);
	p.y				*= pow(2., 4.);
	
	vec3 vertex[3];
	
	for(int i = 0; i < 3; i++)
	{
		
		vertex[i]		= h46cube(float(i) + index.x-1.);
	}

	vec3 point			= vec3(0., 0., 0.);
	vec3 path			= vec3(1., 1., 1.);
	vec3 plot			= vec3(1., 1., 1.);
	vec3 bits			= vec3(0., 0., 0.);
	for(int i = 0; i < 3; i++)
	{
		path[i] 		= min(path[i], edge(p, vec2(-1., vertex[0][i]), vec2( 0., vertex[1][i])));
		path[i]  		= min(path[i], edge(p, vec2( 0., vertex[1][i]), vec2( 1., vertex[2][i])));

		point[i] 		= max(point[i], edge(p, vec2(-2., vertex[0][i]), vec2( 0., vertex[1][i])));
		point[i]  		= max(point[i], length(p - vec2(0., vertex[1][i])));
	

		plot[i] 		= min(plot[i], contour(path[i], 64.)); 		
//		plot[i] 		= max(plot[i], contour(point[i], 32.));		
	}
	
	for(float i = 0.; i < 6.; i++)
	{
		/*
		float x = bitmap(index.x, 0.);
		float y = bitmap(index.x, 1.);
		float z = bitmap(index.x, 2.);
		float u = bitmap(index.x, 3.);
		float v = bitmap(index.x, 4.);
		float w = bitmap(index.x, 5.);
		*/
		
//		bits[int(mod(float(i),3.))]	+= bitmap(index.x, mod(q + i, 6.)) * float(floor(fract(uv.y  * view_layout.y)*6.)==i);	
	}
	
	if(index.y < 3.)
	{
		plot.x				*= float(index.y == 0. || index.y == mouse_index.y);
		plot.y				*= float(index.y == 1. || index.y == mouse_index.y);
		plot.z				*= float(index.y == 2. || index.y == mouse_index.y);
		
		
		bits.x				*= float(index.y == 0. );
		bits.y				*= float(index.y == 1. );
		bits.z				*= float(index.y == 2. );
	}
	
	if(mouse.x < .95)
	{
		plot				*= float(index.y<3.);
		plot 				+= bits/4.;

	}
	
	
//	plot 				+= bits * bitmap(index.x, floor(fract(uv.y*4.)*6.)) * .5;

	gl_FragColor 			= vec4(plot, 1.);
}//sphinx