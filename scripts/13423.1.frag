#ifdef GL_ES
precision mediump float;
#endif

#define PICS 5

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float width;
float height;
float pi = 3.141592; 
vec4 pics[PICS];
vec4 pic2;
vec4 pic3;

float angle;


void GetPic0(float x, float y)
{

	float xx = sin(angle*2.0) * width;
	float yy = cos(angle*2.0) * height;
	x = x - xx;
	y = y - yy;
	
	float val = ((sin(x/30.0) + sin(y/30.0))+0.0)/4.0;
	val = max(val, 0.0);
	val = min(val, 1.0);
	pics[0] = vec4(val, 0, 0, val);
}

void GetPic1(float x, float y)
{

	float xx = mouse.x*width;
	float yy = mouse.y*height;
	x = x - xx;
	y = y - yy;
	
	float val = ((sin(x/15.0) + sin(y/15.0))+0.0)/4.0;
	val = max(val, 0.0);
	val = min(val, 1.0);
	float alpha = 1.0;
	if(val<0.01)
	{
		alpha=val*100.0;
	}
	pics[1] = vec4(val, val, val, alpha);
}


void GetPic2(float x, float y)
{
	if( mod(x,100.0) < 50.0)
	{
		pics[2] = vec4(1.0, 1.0, 1.0, 0.1);
	}
	else
	{
		pics[2] = vec4(1.0, 1.0, 1.0, 0.0);
	}
	
}
void GetPic3(float x, float y)
{
	if( mod(y,100.0) < 50.0)
	{
		pics[3] = vec4(1.0, 1.0, 1.0, 0.1);
	}
	else
	{
		pics[3] = vec4(1.0, 1.0, 1.0, 0.0);
	}
}
void GetPic4(float x, float y)
{
	pics[4] = vec4(1.0, 1.0, 1.0, sin(angle*10.0) / 10.0);
}
vec4 blend (vec4 original, vec4 new)
{
	return original * (1.0-new.a) + new*new.a;
}


void main(void) 
{
	float t = time /10.0;
	angle = mod(t, pi*2.0)-pi;
	width = resolution.x;
	height = resolution.y;

	GetPic0(gl_FragCoord.x, gl_FragCoord.y);
	GetPic1(gl_FragCoord.x, gl_FragCoord.y);
	GetPic2(gl_FragCoord.x, gl_FragCoord.y);
	GetPic3(gl_FragCoord.x, gl_FragCoord.y);
	GetPic4(gl_FragCoord.x, gl_FragCoord.y);
	
	vec4 val = pics[0];

	for(int i=1; i<PICS; i++)
	{
		val = blend(val, pics[i]);
	}
		
	gl_FragColor = val;	

}