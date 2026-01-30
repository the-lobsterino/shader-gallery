#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float Func(float x)
{
	return sin(x*20.0+time*2.0*sin(time/100.0))/90.0/(x+cos(time/1.0)/5.0);	
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);

	vec4 color;
	
	
	float res = Func(position.x);
		
	float diff = abs(res -position.y);
	float diff2 = abs(position.y - 0.0);
	float diff3 = abs(position.x - 0.0);
	
	float size = 0.01+abs(Func(position.x+0.01)-res);
	
	if (diff < size*2.0 && size < 0.1)
	{
		float blue = size*10.0;
		blue*=blue;
		float green;
		float red;
		red = rand(position)*(size-diff)*100.0;
		if (diff > size)
			green = rand(position)*(size*3.0-diff)*40.0-pow(size*10.0,3.0);
		else
			green = 1.0-red;
		
		
		color = vec4(red,green,blue,1.0);
	}
	/*else if (diff2 < 0.003 || diff3 <0.003)
	{
		color = vec4(0.0,rand(position),0.5,1.0);	
	}*/
	else
	{
	

	

	}
	
	if (diff >size || size > 0.1)
	{
		color.r = rand(position+time);
		if (color.g ==0.0)
		color.g = rand(position+time);
		color.b = rand(position+time);

	}
	
	gl_FragColor = color;

}