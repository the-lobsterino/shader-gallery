#ifdef GL_ES
precision mediump float;
#endif
#define iTime time
#define iResolution resolution

float normpdf(in float x, in float sigma)
{
	return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
}

uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
uniform float     iTimeDelta;            // render time (in seconds)
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D iChanne10;             // input channel. XX = 2D/Cube

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	//vec3 c = vec3(1,3,4);
	//float c = texture2D(fragCoord.xy / iResolution.xy);
	vec2 position = ( gl_FragCoord.xy / iResolution.xy );
   	vec3 c = texture2D(iChanne10, position).rgb;
	if (fragCoord.x < iMouse.x)
	{
		fragColor = vec4(c, 1.0);	
	} else {        
		
		//declare stuff
		const int mSize = 11;
		const int kSize = (mSize-1)/2;
		float kernel[mSize];
		
		
		//create the 1-D kernel
		float sigma = 7.0;
		float Z = 0.0;
		for (int j = 0; j <= kSize; ++j)
		{
			kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);
		}
		
		//get the normalization factor (as the gaussian has been clamped)
		for (int j = 0; j < mSize; ++j)
		{
			Z += kernel[j];
		}
		vec3 final_colour = vec3(0.0);
		//read out the texels
		for (int i=-kSize; i <= kSize; ++i)
		{
			for (int j=-kSize; j <= kSize; ++j)
			{
				vec2 position2 = fragCoord.xy+vec2(float(i),float(j));
   				vec3 c2 = texture2D(iChanne10, position2).rgb;
				final_colour += kernel[kSize+j]*kernel[kSize+i]*c2.rgb;
	
			}
		}
		
		
		fragColor = vec4(final_colour/(Z*Z), 1.0);
	}
}
void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}