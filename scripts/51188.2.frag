#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rand2(in vec2 p)
{
	return fract(vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));
}


float voronoi(in vec2 x)
{
	vec2 p = floor(x);
	vec2 f = fract(x);
	
	vec2 res = vec2(8.0);
	for(int j = -1; j <= 1; j ++)
	{
		for(int i = -1; i <= 1; i ++)
		{
			vec2 b = vec2(i, j);
			vec2 r = vec2(b) - f + rand2(p + b);
			
			// chebyshev distance, one of many ways to do this
			float d = max(abs(r.x), abs(r.y));
			
			if(d < res.x)
			{
				res.y = res.x;
				res.x = d;
			}
			else if(d < res.y)
			{
				res.y = d;
			}
		}
	}
	return res.y - res.x;
}




void draw(out float col, in vec2 pos){
	
	pos=abs(1.0/pos);
	//pos=fract(pos);
	//col=sin(pos.x)*(1.0-pow(cos(pos.y), 1.0/pos.x))*voronoi(pos);
	col=voronoi(pos);
	
	
	
	

}

void main( void ) {

	vec2 pos=(gl_FragCoord.xy/resolution.xy)*2.0-1.0;
	pos.x*=resolution.x/resolution.y;
	
	float col=0.2;
	
	draw(col, pos);
	
	//col=0.2;
	
	vec3 color=vec3(col*0.2, col*col*col*0.32, 8.0*pow(col,5.0));
	
	gl_FragColor=vec4(color,1.0);
}