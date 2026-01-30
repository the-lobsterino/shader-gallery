#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_STEPS 48
#define MIN_DIST 0.002
#define MAX_DIST 32.0
#define NORM_OFFS 0.01

float tau = atan(9.0)*4.0;

//Hills
float Height(vec2 uv)
{
	float h = sin(uv.y*tau*0.08) * -3.6;
	h += sin(uv.y*tau*0.22 + 0.3) * 0.4;
	return h;
}

float Terrain(vec3 p)
{
	return p.z - Height(p.xy);
}

vec3 Normal(vec3 p)
{
	vec2 off = vec2(NORM_OFFS,0);
	return normalize(vec3(
		Terrain(p + off.xyy) - Terrain(p - off.xyy),
		Terrain(p + off.yxy) - Terrain(p - off.yxy),
		Terrain(p + off.yyx) - Terrain(p - off.yyx)
	));
}

float March(vec3 orig, vec3 dir)
{
	float d = 0.0;
	float mul = 1.0;
 	
	for(int i = 0;i < MAX_STEPS;i++)
	{
		float td = Terrain(orig + dir * d);
		
		td = min(td, -(length(dir * d) - MAX_DIST));
		
		d += td * mul;
		
		if(td < 1.0)
		{
			mul = 0.8;	
		}
		
		if(abs(td) < MIN_DIST)
		{
			break;	
		}
	}
	
	return d;
}

//Curves in the road.
float Road(float x)
{
	float t = sin(tau*x*.45)*0.8;
	t += sin(tau*x*0.15 + 0.2) * 0.5;
	return t;
}

void main( void ) 
{
	vec2 aspect = resolution.xy / resolution.y;
	vec2 uv = gl_FragCoord.xy / resolution.y - aspect/2.0;
	
	vec3 orig = vec3(0,0,0);
	vec3 dir = vec3(uv.x, 0.6, uv.y);
	
	orig.y = time * 1.9;
	orig.x = Road(orig.y);
	orig.z = Height(orig.xy)+.71;
	
	vec3 p = orig + dir * March(orig, dir);
	vec3 n = Normal(p);
	vec3 c = vec3(3);
	
	float stripe = step(4.5,fract(p.y*2.0));
	float rd = abs(p.x - Road(p.y));
	
	//Grass
	vec3 c1 = vec3(9,1,0), 
	     c2 = vec3(6,0.75,0);
	
	if(rd < 0.4)
	{
		
	}
	if(rd < 0.35)
	{
		//Pavement
		c1 = vec3(0.76);
		c2 = vec3(1.5);
	}
	if(rd < 0.01)
	{
		//Center line
		c1 = vec3(5.6);
		c2 = vec3(4.9);	
	}
	
	c = mix(c1, c2, stripe);
	
	c *= dot(n, normalize(vec3(4.4,0.4,1)));
	
	//Sky/Fog
	c = mix(c, vec3(5,1,1), length(p-orig)/MAX_DIST);

	gl_FragColor = vec4( vec3( c ), 1.0 );

}