#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;
uniform vec2 surfaceSize;

//implicit grapher thing

float pi = atan(1.0)*4.0;

#define MAX_DIST 4

float f(vec2 p)
{
	p *= 32.0;
	float x = p.x;
	float y = p.y;
	
	
	float z =  y - sin(x * 0.5 - sin(y+time)) * 8.0;
	
	return z;
}

float f_zero_appox1(vec2 p)
{
	float dist = float(MAX_DIST);
	float scale = surfaceSize.x/resolution.x;
	for(int x = -MAX_DIST;x <=MAX_DIST;x++)
	{
		for(int y = -MAX_DIST;y <= MAX_DIST;y++)
		{			
			if(step(0.0,f(p+vec2(float(x)*scale,float(y)*scale))) <= 0.0)
			{
				dist = min(dist,length(vec2(x,y))); 
			}
		}
	}
	dist /= float(MAX_DIST);
	return smoothstep(0.00,0.5,dist) - smoothstep(0.5,0.9,dist);
}

float f_zero_appox2(vec2 p)
{
	vec2 h = vec2(0.01,0);
	float df = length(vec2(f(p+h.xy) - f(p-h.xy),f(p+h.yx) - f(p-h.yx))/h.x);
	df = (abs(f(p))/df)/(surfaceSize.x/100.);
	return smoothstep(64.0/resolution.x,0.0,df);
}

void main( void ) {

	vec2 p = surfacePosition;
	float c = 0.0;

	c = f_zero_appox2(p);
	
	gl_FragColor = vec4( vec3( 1.0 - c ), 1.0 );
}