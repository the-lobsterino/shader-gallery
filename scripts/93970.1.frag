#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// modified colors by @hintz

void main(void) 
{
	vec2 b = 2.0 * fract(gl_FragCoord.xy/160.0)-1.;
	b=b*b*8.;
	vec3 c1 = vec3(.95, .90, 0.750)-mod(b.x+b.y,.4);
	vec3 cb = vec3(0.370);
	vec3 c3 = vec3(0.98, .54, .30)+mod(b.x+b.y,.3);
	
	int x = int(b.x);
	int y = int(b.y);

	vec3 g = cb;
	
	if (y == 0) 
	{
		g = x == 3 || x == 5 ? c1 : cb;
	}
	else if (y == 1)
	{
		g = x == 0 ? cb : x == 5 ? c1 : c3;
	}
	else if (y==2 || y==6) 
	{
		g = x == 0 || x == 2 || x == 4 || x == 6 ? cb : (x == 1 || x == 7) ? c3 : c1;
	}
	else if (y == 3) 
	{
		g = x==4 ? cb : x==7 ? c3 : c1;
	}
	else if (y == 4) 
	{
		g = x==1||x==7 ? c3 : cb;
	}
	else if (y == 5) 
	{
		g = x==4 ? cb : x==1 ? c3 : c1;
	}
	else if (y == 7) 
	{	
		g = x == 0 ? cb : x == 3 ? c1 : c3;
	}
	
	float sh = 0.0;
	vec3 d = 0.8 * g;

	if (y==3&&x==6 || y==5&&x==0 || y==1&&x==4 || y==7&&x==2) 
	{
		g = mix(g, d, smoothstep(sh, 1.0, fract(b.x)));
	}
	else if (/*y==3&&x==0 ||*/ y==5&&x==2 || y==1&&x==6 || y==7&&x==4) 
	{
		g = mix(g, d, smoothstep(1.0-sh, 0.0, fract(b.x)));
	}
	else if (y==0&&x==3 || y==6&&x==5 || y==2&&x==1 || y==4&&x==7) 
	{
		g = mix(g, d, smoothstep(sh, 1.0, fract(b.y)));
	}
	else if (y==2&&x==3 || /*y==0&&x==5 ||*/ y==4&&x==1 || y==6&&x==7) 
	{
		g = mix(g, d, smoothstep(1.0-sh, 0.0, fract(b.y)));
	}
	
	
	gl_FragColor = vec4(g, 1.0);
}