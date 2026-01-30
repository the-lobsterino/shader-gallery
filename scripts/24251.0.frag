#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float code (float val)
{
	return 1.0/val;
	return val;
}

float decode (float val)
{
	return code(val);
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec3 col = vec3(0.0);
	
// Form
	vec3 color = vec3(1.0,0.0,0.0);
	vec2 mid = vec2(0.5);
	float r = 0.1;
	float rad = r;
	
	
	vec2 p = uv-mid;
	float w = atan(p.y,p.x);
	float f = 10.0*length(p);
	f = 4.0;
	r += (r/2.0)*sin(w*f+((asin(sin(time*6.0))/90.0)*400.0)*length(p));
	//r = rad;
	//r *= step(0.5,uv.x);
	
	
	
	float inside = smoothstep(r,r-(sin(time*5.0)/5.0),length(p));
	//inside = 1.0-step(r,length(p));
	col += color*inside;
// End Form
//
//
//distance field
	vec3 bCol = texture2D(backbuffer, uv).rgb;
	

	
	float dist = 0.0;
	float shortest = 1.0/0.0;
	
	//if (bCol.r <= 0.0)
	if (0.0 <= 0.0)
	{
		for (int x = -1; x <= 1;x++)
		{
			for (int y = -1; y <= 1;y++)
			{
				if(x!= 0 && y != 0)
				{
					bCol = texture2D(backbuffer, uv+vec2(float(x),float(y))/resolution.xy).rgb;
					dist = decode(bCol.g);
					//dist *= 1.0-step(0.0001,bCol.r);
					if (bCol.r>0.0)
						dist = 0.0;
					shortest = min(shortest,dist);
					
				}
			}
		}
		col += vec3(col.r,code(shortest+0.03),.0)*(1.0-inside);
		//col = mix(vec3(0.0,code(shortest+0.03),0.0),bCol,bCol.r);
		//col.g = code(shortest+0.03);
	}
	
	
//End distance field
	//col.b = 1.0/col.g;
	
	gl_FragColor = vec4(col*step(0.1,length(mouse-mid)), 1.0 );

}