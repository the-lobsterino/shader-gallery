#ifdef GL_ES
precision highp float;
#endif



///// position mouse in the middle to reset

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float code (float val)
{
	//return 1.0/val;
	//return 1./exp2(val+1.0);
	return val;
}

float decode (float val)
{
	return val;
	//return -1.0-log2(val);
	//return code(val);
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec4 col = vec4(0.0);
	col.a = 1.0;
	
// Form
	vec3 color = vec3(1.0,0.0,0.0);
	vec2 mid = vec2(0.5);
	float r = 0.1;
	float rad = r;
	
	
	vec2 p = uv-mid;
	float w = atan(p.y,p.x);
	float f = 10.0*length(p);
	f = 2.0;
	r += (r/2.0)*sin(w*f+100.0*length(p));
	//r = rad;
	r *= step(0.5,uv.x);
	
	
	
	float inside = smoothstep(r,r-0.0001,length(p));
	//inside = 1.0-step(r,length(p));
	if (inside > 0.01)
		col += vec4(color*inside,0.0);
// End Form
//
//
//distance field
	vec4 bCol = texture2D(backbuffer, uv);
	

	
	float dist = 0.0;
	float shortest = 1.0/0.0;
	float op;
	float it = 1.;
	//if (bCol.r <= 0.0)
	//bCol = texture2D(backbuffer, uv).rgba;
	

		for (int x = -1; x <= 1;x++)
		{
			for (int y = -1; y <= 1;y++)
			{
				if(x!= 0 && y != 0)
				{
					bCol = texture2D( backbuffer, uv + vec2(float(x),float(y)) / resolution.xy );
					dist = bCol.a;
				
					
					if (inside>0.0)
						dist = 0.0;
					
					
					
					dist += it * length( vec2(float(x), float(y)) / resolution.xy );
					
					shortest = min(shortest,dist);
					
				}
			}
		}

		//col += vec4(vec3(col.r,0.0,0.0),1.0);
	
	
	col.a = shortest;
	
///recalculate distance
	//calculate direction
	
		const int iter1 = 90;
		const int iter2= 1;
		const float e = 0.001;
		const float stepsize = 0.2;
		 p = vec2(0.0);
		vec2 pos = vec2(0.0);
		shortest = 1.0/0.0;
					
		for (int i = 0; i <= iter1;i++)
		{
			//find neighbor with lowest distance
				for (int x = -1; x <= 1;x++)
				{
					for (int y = -1; y <= 1;y++)
					{
						bCol = texture2D(backbuffer, uv+pos+vec2(float(x),float(y))/resolution.xy);
						dist = bCol.a;
						if (inside >0.1) 
						{	dist = 0.0;
							p =vec2(0.0);
						 	break;
						}else
						
						if (dist < shortest)
						{
							
							shortest = dist;
							p =vec2(float(x),float(y))/resolution.xy;
						}
					}
				}
			
				pos += p;
				p = vec2(0.0);
				shortest = 1.0/0.0;
			//End find neighbor with lowest distance
		}
	
		//p = p/float(iter1);
		//col.a = length(pos);
		col.b = length(pos);//atan(pos.y,pos.x)/4.;
		p = normalize(pos);
				
	//End Calculate direction
	
	//find surface//
		pos = p;
		for (int i = 0; i <= iter2;i++) 
		{
			
		
			bCol = texture2D(backbuffer, uv+pos);
			dist = bCol.a;
			
			if (inside>0.0)
				dist = 0.0;
			if (dist <= e)
				break;
		
		 	pos +=	p*dist*stepsize;
		
		}
		
		//col.g = length(pos);
	
	//End find surface
	
//End recalculate distance
		

	
	
	
//End distance field
	//col.b = 1.0/col.g;
	
	//col.g = (1.0-1./exp2(col.a))*(1.0-inside);//(1.0/(1.0-col.a))*(1.0-inside);
	//col.g = (1./(col.a))*(1.0-inside);
	//col.b = (1.0-sqrt(col.a))*(1.0-inside);
	
	//Circle
		dist = (texture2D(backbuffer,mouse).a);
		r = 0.01;
		col.b += smoothstep(dist,dist-0.001,length(-mouse +uv))-smoothstep(dist-r,dist-r-0.001,length(-mouse +uv));
	
	if (0.0 ==step(0.01,length(mouse-mid))) col = vec4(vec3(0.0),1.0/0.0);
	
	gl_FragColor = vec4(col);//*step(0.01,length(mouse-mid));
}