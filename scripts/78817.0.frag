// I just want to make a flame...please help me!!!

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

vec4 t_color = vec4(4.0, 0.5, 0.1, 6.0);
vec4 b_color = vec4(0., 0.3, 1.0, 12.0);

float noise(vec3 p) //Thx to Las^Mercury
{
	vec3 i = floor(p);
	vec4 a = dot(i, vec3(1., 57., 71.)) + vec4(0., 57., 21., 78.);
	vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;
	a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
	a.xy = mix(a.xz, a.yw, f.y);
	return mix(a.x, a.y, f.z);
}

float sphere(vec3 p, vec4 spr)
{
	return length(spr.xyz-p) - spr.w;
}

float flame(vec3 p)
{
	float d = sphere(p*vec3(1.,.5,1.0), vec4(.0,-1.,.0,1.));
	return d + (noise(p+vec3(time/3.3,time*7.,.0)) + noise(p*7.)*.1)*.25*(p.y) ;
}

float scene(vec3 p)
{
	return min(150.-length(p) , abs(flame(p)) );
}

vec4 raymarch(vec3 org, vec3 dir)
{
	float d = 0.01, glow = 0.3, eps = 0.01;
	vec3  p = org;
	bool glowed = false;
	
	for(int i=0; i<64; i++)
	{
		d = scene(p) + eps;
		p += d * dir;
		if( d>eps )
		{
			if(flame(p) < .0)
				glowed=true;
			if(glowed)
       			glow = float(i)/64.;
		}
	}
	return vec4(p,glow);
}

void main(void)
{
	vec2 v = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
	v.x *= resolution.x/resolution.y;
	
	vec3 org = vec3(0., -2., 4.);
	vec3 dir = normalize(vec3(v.x*1.6, -v.y, -1.5));
	
	vec4 p = raymarch(org, dir);
	float glow = p.w;
	
	vec4 col = mix(t_color, b_color, p.y*.02+.4);
	
	gl_FragColor = mix(vec4(0.), col, pow(glow*2.,4.));
}