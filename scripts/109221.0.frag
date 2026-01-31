#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D last;

//#define VIEW_KERNEL
//#define VIEW_LIFEFUNC

#define KERNEL_SIZE 12
#define KERNEL_IN_SCALE 0.5

float getValue(vec2 uv)
{
	return texture2D(last, mod(uv / resolution,1.0)).a;	
}

vec2 getKernel(vec2 off)
{
	float l = length(off);
	float ks = float(KERNEL_SIZE);
	vec2 k = vec2(0);
	
	k.x = 1.0 - step(ks * KERNEL_IN_SCALE, l);
	k.y = (1.0 - step(ks, l)) - k.x;
	
	return k;
}

vec2 sumKernel(vec2 uv)
{
	vec2 tw = vec2(0);
	vec2 mw = vec2(0);
	
	for(int i = -KERNEL_SIZE;i <= KERNEL_SIZE;i++)
	{
		for(int j = -KERNEL_SIZE;j <= KERNEL_SIZE;j++)
		{
			vec2 off = vec2(i,j);
			vec2 k = getKernel(off);
			
			if((i*i + j*j) > KERNEL_SIZE*KERNEL_SIZE)
			{
				continue;	
			}
			
			mw += k;
			tw += k * getValue(uv + off);
		}
	}
	
	return tw / mw;
}

float lifeFunction(vec2 nm)
{
	float gw = 0.04;
	float gsl = 0.26;
	float gel = 0.40;
	float gsh = 0.70;
	float geh = 0.95;

	float gmix = smoothstep(0.12, 0.60, nm.y);
	
	float gs = mix(gsl, gsh, gmix);
	float ge = mix(gel, geh, gmix);
	
	return smoothstep(gs - gw, gs + gw, nm.x) - smoothstep(ge - gw, ge + gw, nm.x);
}

void main( void ) 
{
	vec2 uv = gl_FragCoord.xy;

	float lastVal = getValue(uv);
	
	vec2 cell = sumKernel(uv);
	
	float value = 0.2 * (lifeFunction(cell) - lastVal) + lastVal;
	
	value += .0 - step(7.0, distance(uv, mouse * resolution));
	
	value *= step(0.1, length(mouse));
	
	gl_FragColor = vec4( vec3( value + cell.x, value + cell.y, value * 0.5), value );
	
	#ifdef VIEW_KERNEL
	gl_FragColor.rgb = vec3(getKernel(uv - resolution/2.0),0.0);
	#endif
	#ifdef VIEW_LIFEFUNC
	gl_FragColor.rgb = vec3(lifeFunction(uv / resolution));
	#endif
}

