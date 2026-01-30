#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;
vec4 encode(float x)// 0 - 2^24
{
	//Shift each 8 bit chunk into the lowest 8 bits of the component. vec4(x) / exp2(vec4(0, 8, 16, 24))
	//Cut off fractional part and higher bits. floor(mod( ... , 256.0))
	//Scale to 0.0 - 1.0 range for backbuffer. ... / 255.0;
	return floor(mod(vec4(x) / exp2(vec4(0, 8, 16, 24)), 256.0)) / 255.0;
	
}
float decode(vec4 x)
{
	//Scale each component to 0-255 range. x * 255.0
	//Shift each 8-bit chunk in the correct position. ... * exp2(vec4(0, 8, 16, 24))
	//Sum all of the components dot( ... , vec4(1))
	return dot(x * 255.0 * exp2(vec4(0, 8, 16, 24)), vec4(1));
}

vec4 getmem(int x)
{
	return texture2D(bb,vec2(float(x*2+1)/resolution.x,0.0));
}
void main( void )
{
	vec2 m=mouse*resolution;
	ivec2 gpos=ivec2(floor(gl_FragCoord.xy))/2;
	float DeltaTime = time - decode(getmem(2))/1024.0;
	DeltaTime = clamp(DeltaTime ,0.0 , 1.0);
	if(gpos.y ==0)
	{
		bool reschng=
			(floor(decode(getmem(3))) != floor(resolution.x))||
			(floor(decode(getmem(4))) != floor(resolution.y));
		
		if( gpos.x == 0 ) // mouse.x
		{
			float xx=decode(getmem(0))/1024.0;
			xx=m.x + (xx-m.x)*(pow(0.5,DeltaTime*1.0));
			gl_FragColor=encode(xx*1024.0);
			if(reschng)
				gl_FragColor=encode(m.x*1024.0);
			return;
		}
		if( gpos.x == 1 ) // mouse.y
		{
			float xx=decode(getmem(1))/1024.0;
			xx=m.y + (xx-m.y)*(pow(0.5,DeltaTime*1.0));
			gl_FragColor=encode(xx*1024.0);
			if(reschng)
				gl_FragColor=encode(m.y*1024.0);
			return;
		}
		if( gpos.x == 2 ) // time
		{
			gl_FragColor=encode(time*1024.0);
			return;
		}
		
		if( gpos.x == 3 ) // reset values if resolution change
		{
			gl_FragColor = encode(floor(resolution.x));
			return;
		}
		if( gpos.x == 4 ) // reset values if resolution change
		{
			gl_FragColor = encode(floor(resolution.y));
			return;
		}
	}
	
	bool iff = false;
	iff=iff||floor(gl_FragCoord.x)==floor(decode(getmem(0))/1024.0);
	iff=iff||floor(gl_FragCoord.y)==floor(decode(getmem(1))/1024.0);
	gl_FragColor=vec4(iff);
}