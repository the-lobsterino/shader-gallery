#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float sigmaFun(float x)
{
	return 1.0/(1.0+exp(-x));
}

vec4 colormap(float x){

	
	return vec4( smoothstep(0.0,1.0,1.0/x),  smoothstep(0.0,1.0,x*x), smoothstep(0.0,1.0,x),1.0);	
}

float CalcZ_EquestionOfSauss(vec2 xy, float sigma)
{
	return  (1.0 / (2.0 * 3.14 * sigma)) * (dot(xy,xy) / 2.0 * sigma);
}

float Hash( vec2 p)
{
     vec3 p2 = vec3(p.xy,1.0);
    return fract(sin(dot(p2,vec3(37.1,61.7, 12.4)))*3758.5453123);
}

void main( void ) {

	vec2 p = gl_FragCoord.xy-resolution/2.0;	
	
	p*=2.0;
	
	vec4 color=vec4(0.0,0.0,0.0,1.0);
	
	float t =sigmaFun(sin(time));
	
	float x =0.0;
	
	
	for(int i =1;i<10;i++)
	{
		for (int j=1;j<10;j++)
		{

			color+=colormap(CalcZ_EquestionOfSauss(p*0.5*t+20.0*t*vec2(-float(i)*cos(time),-float(j)*sin(time)),0.5));
			color+=colormap(CalcZ_EquestionOfSauss(p*0.5*t+20.0*t*vec2(float(i)*cos(time),float(j)*sin(time)),0.5));
			color+=colormap(CalcZ_EquestionOfSauss(p*0.5*t+20.0*t*vec2(-float(i)*cos(time),float(j)*sin(time)),0.5));
			color+=colormap(CalcZ_EquestionOfSauss(p*0.5*t+20.0*t*vec2(float(i)*cos(time),-float(j)*sin(time)),0.5));
		}
	}
	
	
	color.g=0.01;
	
	color.b=0.3;
	
	gl_FragColor = color;
}