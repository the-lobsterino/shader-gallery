#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//number of unique symbols 
#define SYMBOLS 7

//number of elements to encode - just decoding here, so its only for show
#define ELEMENTS 4

//visualize as polar coordinates
#define POLAR


//now to get rid of all these awful iterations...



void 	arithmetic_decode( in float code, in float probability[SYMBOLS], out float series[ELEMENTS]);

float	sum(in float v[SYMBOLS]);
void	div(inout float v[SYMBOLS], in float divisor);

void    assign_random_mass(in vec2 p, out float probability[SYMBOLS]);
float	hash(vec2 uv);
vec3	hsv(float h,float s,float v);

void main( void ) 
{
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	
	#ifdef POLAR
	uv		-= .5;
	uv		*= resolution.xy/resolution.yy;
	uv		= vec2((atan(uv.x, uv.y)+(4.*atan(1.)))/(8.*atan(1.)), length(uv*2.));
	#endif
	
	float series[ELEMENTS];
	
	float t		= time * .5;
	float a		= atan(1.);
	float mass[8];
	
	float probability[SYMBOLS];
	assign_random_mass(mouse, probability);	//assigning some random values, else make up your own values for probability[0->SYMBOLS]
	div(probability, sum(probability));
	
	float phase	= uv.x; //all encodings of the space
	
	arithmetic_decode(phase, probability, series);
	

	for(int i = 0; i < ELEMENTS; i++)
	{
		if(floor(uv.y * float(ELEMENTS)) == float(i))
		{
			gl_FragColor  = vec4(hsv(series[i]/float(SYMBOLS+1), 1., 1.),1.);
		}
	}
	
}//sphinx

void arithmetic_decode(in float phase, in float probability[SYMBOLS], out float series[ELEMENTS])
{
	float field = phase;
	float interval[SYMBOLS];
	for(int i = 0; i < SYMBOLS; i++)
	{
		interval[i] = probability[i];
	}
	
	float mass[SYMBOLS];
	for(int i = 0; i < ELEMENTS; i++)
	{
		float sum[SYMBOLS];
		sum[0] = interval[0];
		for(int j = 1; j < SYMBOLS-1; j++)
		{
			sum[j] = sum[j-1]+interval[j];
		}
		sum[SYMBOLS-1] = 1.;

		mass[0]	= float(phase < sum[0]);
		for(int j = 1; j < SYMBOLS; j++)
		{
			mass[j]	= float(phase >= sum[j-1] && phase < sum[j]);
		}
		
		for(int j = 0; j < SYMBOLS-1; j++)
		{
			phase -= mass[j + 1] * sum[j];
		}
		
		float maximum	= 0.;
		float scale	= 0.;
		float symbol	= 0.;
		float interm	= 0.;
		for(int j = 0; j < SYMBOLS; j++)
		{
			bool larger = maximum < mass[j];
			scale	= larger ? probability[j] : scale;
			interm	= larger ? probability[j] : interm;
			maximum = larger ?        mass[j] : maximum;
			symbol	= larger ?	 float(j) : symbol;
		}
		
		for(int j = 0; j < SYMBOLS; j++)
		{
			interval[j] *= scale;
		}
	
		series[i] = symbol;
	}
}

float sum(in float v[SYMBOLS])
{
	float total = 0.;
	for(int i = 0; i < SYMBOLS; i++)
	{
		total += v[i];		
	}
	
	return total;
}

void div(inout float v[SYMBOLS], in float divisor)
{
	for(int i = 0; i < SYMBOLS; i++)
	{
		v[i] /= divisor;
	}
}

float hash(vec2 uv)
{
	return fract(cos(uv.x+sin(uv.y))*12345.6789);
}

vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

void assign_random_mass(in vec2 p, out float probability[SYMBOLS])
{
	for(int i = 0; i < SYMBOLS; i++)
	{
		probability[i] = hash(p + 1./float(i+1));
	}
}

