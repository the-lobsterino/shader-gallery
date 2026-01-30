#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdf_smin(float a, float b, float k)
{
	float res = exp(-k*a) + exp(-k*b);
	return -log(max(0.0001,res)) / k;
}

float sdf_circ(vec2 pos, float rad)
{
	float r = distance(pos, vec2(0));
	return r-rad;
}	

float sdf_ring(vec2 pos, float rad)
{
	float thick = rad*.1;
	return length( vec2(length(pos)-rad) )-thick;
}

void main() {
	vec2 pos = gl_FragCoord.xy / resolution - vec2(0.5, 0.5);
	pos.x *= resolution.x/resolution.y;
	
	vec3 color = vec3(0.0);
	
	float d = sdf_ring(pos, 0.3);
	
	
	for(int i=0; i<3; i++)
	{
		float offset = float(i)/6.0*6.28;
		float size = 0.1 + sin(offset*2.0+time*3.0)*0.05;
		float next = sdf_ring(pos+vec2(sin(time+offset)*.3, cos(time+offset)*.3), size);
		d = sdf_smin(d, next, 32.0);
		d = clamp(d, -100.0, 100.0);
	}
	
	
	
	if(d < 0.001)
	{	
		color.r = 1.0;
		color.g = 1.0+d*10.0;
		color.b = 0.25;
	}
	else
	{
		color.r = 1.0-d*10.0;
		color.b = fract(d*15.0)*.5;
		color.g = fract(d*5.0)*.3;
	}
	
	gl_FragColor = vec4(color, 1.0);
}