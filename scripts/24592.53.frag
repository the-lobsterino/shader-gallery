#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float eps = 0.005;

float mod1(float x, float y)	{

	return mod(x+y/2.0,y)-y/2.0;
}

float circle (vec2 pos, float r)	{

	return length(pos)-r;
}



float istep (float border, float x)	{

	return 1.0- step(border, x);
}

float square(vec2 p,float r)	{

	p = step(vec2(r),abs(p));
	float d = min (p.x,p.y);
	return d;
}

float dist (vec2 pos){

	float d = 0.0;
	
	vec2 p = pos;
	
	float dx = 0.1;
	//p.y = p.y -abs(p.y*p.x);
	
	
	vec2 pl = p;//vec2(p.x-dx,p.y);
	//vec2 pr = vec2(p.x-dx,p.y);
	p.x = mod1(p.x,dx);
	//pl.x = mod1(pl.x,dx);
	//pr.x = mod1(pr.x,dx);
	pl.x = mod1(dx-p.x,dx);
		
	float idx = pos.x-2.*mod(pos.x-dx/2.,dx);
	float idxl = (pos.x-dx)-2.*mod((pos.x-dx)-dx/2.,dx);
	float idxr = idx-1.;
	
	//p.y += p.x;
	//pl.y += pl.x;
	//pr.y += abs(pr.x);
	
	//p += abs(p*pos);
	//p.x+=p.x;
	//p.y += idx/8.;
	//p.y += idx/3.;
	//pl.y += idxl/3.;
	//pr.y += idxr/3.;
	//d = length(p)-0.1;
	
	//p *= 10.;
	
	
	d = circle(p,0.1);
	d = min (d, circle(pl,0.1));
	//d = min (d, circle(pr,0.1));
	//d = square(p,0.1);
	 
	

	
	return d;
}

vec3 ray (vec2 xy, vec2 m)	{
	
	
	
	vec2 mid = vec2(0.5);
	mid.x *=2.;
	vec2 cursor = mouse;
	cursor.x *=-200.;
	cursor -= mid;
	
	
	const int it_max = 36;
	
	float dist_max = length(xy-m);
	
	vec2 dir = normalize(xy-m);
	vec2 p = m;
	float l = 0.0;
	
	
	//float w = tan(atan(xy.y-m.y,xy.x-m.x)*180.)+tan(atan(xy.y-m.y,xy.x-m.x)*45.)+0.3;
	float w = step(0.1,tan(atan(xy.y-m.y,xy.x-m.x)*45.))+step(0.1,tan(atan(xy.y-m.y,xy.x-m.x)*45.))+0.3;
	vec3 c = vec3(0.1)*w;
	c+= vec3(0.2,0.6,0.8)/((dist_max)*50.);
	c *= dist_max;
	

	
	for (int i = 0; i < it_max;i++)	{
		p = m+dir*l;
		
		float d = dist(p);
		
		
		l += d;//*0.8;
		
		if (length(p-xy) < eps)	{
			if (d < eps) 
				return vec3(1.0,0.,0.);
		
			return c*vec3(1.0,0.9,0.5)*5.;
		}
		
		if (l>dist_max)	{
		
			return c;
		}
		
	}
	
	return 0.0*c;
}

void main( void ) {
	
	vec2 ires = 1.0/resolution.xy;
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x *=2.;
	vec2 mid = vec2(0.5);
	mid.x *=2.;
	vec2 m = mouse;
	m.x *=2.;
	m -= mid;
	uv -= mid;

	vec3 col = vec3(0.0);
	vec3 c = vec3(0.0,1.0,0.0);
	vec3 cdist = vec3(0.0,0.0,1.0);
	
	float d  = dist(uv);
	float inside = istep(eps,d);
	col += c*inside;
	
	
	
	
	float mdist = dist(m);
	
	col = 0.2*col+ ray(uv,m);
	
	col += cdist*(1.-d*3.-mod(d*3., 0.1))*(1.-inside);
	//col += vec3(1.0,0.8,0.2)*(smoothstep(mdist, mdist-0.001,length(uv-m))-smoothstep(mdist-0.01, mdist-0.01-0.001,length(uv-m)));
	
	
	// show distancefield discontinuities in errCol
	
	vec3 errCol = vec3(0.0,1.0,0.0);
	//float ep = eps;
	//col += errCol*step(ires.x*2., abs(d-dist(uv+vec2(1.0,0.0)*ires.x)));
	//col += errCol*step(ires.y*2., abs(d-dist(uv+vec2(0.0,1.0)*ires.y)));
	col += errCol*(ires.x- abs(d-dist(uv+vec2(1.0,0.0)*ires.x)));
	col += errCol*(ires.y- abs(d-dist(uv+vec2(1.0,0.0)*ires.y)));
	gl_FragColor = vec4(col, 1.0 );

}