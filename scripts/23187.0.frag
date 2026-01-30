#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float PI=3.14159265;
#define STEP1 128
#define STEP2 64

vec2 dist_floor(in vec3 p)
{
	return vec2(sin(p.x*0.1)*2.0+
		    sin(p.y*0.1)*2.0+
		    p.y+10.0,0);
}

vec2 sphere(in vec3 p,in vec3 sh_p,in float size,in float id)
{
	float d = length(p - sh_p)-size;
	return vec2(d,id);
}

vec2 cylinder(in vec3 p,in vec3 cy_p,in float size,in float id)
{
	return vec2(length(p.xz-cy_p.xz)-size,id);
}

vec2 dist_gass(in vec3 p)
{
	p.x += sin(time+p.y*0.5);
	if(sin(p.x*10.5) > 0.9 && sin(p.z*1.5) > 0.6 )
	{
		vec2 floor_d = dist_floor(p);
		return vec2(floor_d.x+p.y*13.0,0);
	}
	return vec2(1000,0);
}

//select short dist
vec2 uni(in vec2 obj0, in vec2 obj1)
{
	if (obj0.x < obj1.x)
    	return obj0;
	else
    	return obj1;
}

//distance field scene
vec2 scene(in vec3 p)
{
	vec2 dist = vec2(1000,0);;
	dist = uni( dist , sphere(p,vec3(sin(time)*5.0,4,15),2.0,1.0) );
	dist = uni( dist , sphere(p,vec3(cos(time)*10.0,-4,25),2.0,2.0) );
	dist = uni( dist , sphere(p,vec3(sin(time)*-10.0,12,55),2.0,3.0) );
	dist = uni( dist , dist_gass(p) );
	return dist;
}

vec3 select_material(in vec3 p,in float id)
{
	if(id == 0.0)
    		return vec3(1);
	if(id == 1.0)
    		return vec3(0.1,0.1,0.8);
	if(id == 2.0)
   		return vec3(0.8,0.1,0.1);
	if(id == 3.0)
    		return vec3(0.1,0.8,0.1);
	if(id == 4.0)
    		return vec3(0.8,0.8,0.8);
	return vec3(0);
}
void main(void)
{
	vec2 vPos = gl_FragCoord.xy/resolution.xy - 0.5;
	// Camera up vector.
	vec3 vuv=vec3(0,1.0,0);
    
	// Camera lookat.
	vec3 cpos=vec3(0,13,50);
	float mx=4.8+mouse.x/resolution.x*4.0;
	float my=0.0+mouse.y/resolution.y*4.0;
	vec3 prp=vec3(cos(my)*cos(mx),sin(my),cos(my)*sin(mx))*12.0;

    	// Camera setup.
	vec3 vpn=normalize(cpos-prp + vec3((mouse.x-0.5)*100.0,0,1));
	vec3 u=normalize(cross(vuv,vpn));
	vec3 v=cross(vpn,u);
	vec3 vcv=(prp+vpn);
	vec3 scrCoord=vcv+vPos.x*u*resolution.x/resolution.y+vPos.y*v;
	vec3 scp=normalize(scrCoord-prp);
	
	vec3 L = vec3(0,15,35);
	// Raymarching.
	const vec3 e=vec3(0.02,0,0);
	const float maxd=100.0;//Max depth
	vec2 d=vec2(0.1,0.0);
	vec3 p,N;
	
	float volLight = 0.0;
	vec2 dl=vec2(0.1,0.0);
	vec3 pl;
	float f=1.0;
	for(int m_c=STEP1;m_c>0;m_c--)
	{
		if ((abs(d.x) < .001) || (f > maxd))
			break;
	
		f+=min(d.x,1.0);
	
		p=prp+scp*f;
		d = scene(p);
	
		float fl=1.0;
       		dl=vec2(0.1,0.0);
		for(int j=0;j<STEP2;j++)
		{
			if ((abs(dl.x) < 0.01))
			break;
	
			fl+=dl.x;
			pl=p+normalize(L-p)*fl;
			dl = scene(pl);
		
			if( abs(dl.x) >= length(L-pl)  || (fl > maxd))
			{
			fl = maxd + 1.0;
			break;
			}
		}

		if(fl > maxd)
		{
			volLight += 0.7/pow(length(L-p),1.5);
		}

		if(m_c == 0)
		{
			f = maxd+1.0;
			break;
		}        
	}
    
    	volLight = pow(volLight,2.0);
    
	if (f < maxd)
	{
		vec3 col = select_material(p,d.y);
		vec3 n = vec3(d.x-scene(p-e.xyy).x,
				d.x-scene(p-e.yxy).x,
				d.x-scene(p-e.yyx).x);
		N = normalize(n);
    		float b=dot(N,normalize(prp-p+L));
    		gl_FragColor=vec4((b*col)*(1.0-f*.01),1.0)+volLight;
	}
	else
	{
		gl_FragColor= vec4(volLight,volLight,volLight,1);//background color
	}
}

