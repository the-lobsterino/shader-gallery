precision highp float;
// A deform version.... -by harley!  - SEE u @ TrSac ;-)
uniform float time;
uniform vec2 resolution;

//80s Sci-Fi style thing.



const vec3 bgColor=vec3(0.1);

float tau = atan(1.0)*8.0;

float linstep(float x0, float x1, float xn)
{
	return (xn - x0) / (x1 - x0);
}

float cdist(vec2 v0, vec2 v1)
{
	v0 = abs(v0-v1);
	return max(v0.x,v0.y);
}

vec3 retrograd(float x0, float x1, vec2 uv)
{
	float mid = 0.4 + sin(uv.x*8.0)*0.135;

	vec3 grad1 = mix(vec3(0.60, 1.90, 1.00), vec3(0.05, 0.05, 0.40), linstep(mid, x1, uv.y));
	vec3 grad2 = mix(vec3(4.90, 1.30, 1.00), vec3(0.10, 0.10, 0.00), linstep(x0, mid, uv.y));

	return mix(grad2, grad1, smoothstep(mid, mid + 0.208, uv.y));
}

float dline(vec2 p0,vec2 p1,vec2 uv)
{
	vec2 dir = normalize(p1-p0);
	uv = (uv-p0) * mat2(dir.x,dir.y,-dir.y,dir.x);
	return distance(uv,clamp(uv,vec2(0),vec2(distance(p0,p1),0)));
}

void main( void )
{

	vec2 p = gl_FragCoord.xy/resolution.xy -0.5;
	p.x *= resolution.x/resolution.y;	    
	p.y +=-0.3;
 
	// deformation of radius
	float time = time+length(p*18.);
	const float ITER = 16.0;
	float s= 0.0;
	for(float i = 0.0; i < ITER; i++)
	{
		float r=.2*(i+sin(time+i))*pow(cos(time-atan(p.x,p.y+i*0.04)*i), 5.0);
		s += pow(min(1.0, length(p) - r),1.0);
	}
	s/= ITER;
	vec3 col = vec3(1.0) * smoothstep(0.2, 0.4, pow(s,1.0));
	vec2 aspect = resolution.xy / resolution.y;
	vec2 uv = gl_FragCoord.xy / resolution.y;
	vec2 cen = aspect/2.0;

	vec3 color = vec3(0);

	vec3 tricol = retrograd(0.1, 0.8, uv);
	///// Move the trangle  = change numbers... ////
	float move1 = 12.7; 
	float move2 = 12.9;
	////////////////////////////
	
	float tri = 1e4;
	for(int i = 0;i < 53;i++)
	{
		float a0 = tau * (float(i + 0) / 6.0) + (tau/move1);
		float a1 = tau * (float(i - 1) / 3.0) + (tau/move2);

		tri = min(tri, dline(0.4*vec2(cos(a0), sin(a0)), 0.4*vec2(cos(a1), sin(a1)), uv - cen));
	}

	tri = min(tri, abs(distance(uv, cen) - 0.13));

	tricol *= smoothstep(0.015,0.013, tri);

	float trimix = smoothstep(0.020,0.015,tri);

	vec2 gruv = uv-cen;
	gruv = vec2(gruv.x * abs(1.0/gruv.y), abs(1.0/gruv.y));
	gruv.y = clamp(gruv.y,-1e2,1e2);

	float grid = 2.0 * cdist(vec2(0.5), mod((gruv)*1.0,vec2(1)));
		
	float gridmix = max(pow(grid,6.0) * 1.2, smoothstep(0.93,0.98,grid) * 3.0);

	vec3 gridcol = (mix(vec3(0.00, 0.00, 0.90), vec3(0.90, 0.00, 0.90), uv.y*2.0) + 1.2) * gridmix;
	gridcol *= linstep(0.1,1.5,abs(uv.y - cen.y));

	color = mix(gridcol, tricol, col);

	gl_FragColor = vec4( color, 1.0 );
}



