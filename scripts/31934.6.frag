#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
const float width = 4.0;
const float coordWidth = 4.0;
uniform float time;
const float scale = 100.0;
uniform vec2 mouse;
uniform vec2 resolution;

float func(float x){
	return sin(x);
}
float funcB(float x)
{
	
	return fract(x)+-1.0;
}


void main( void ) {
	bool func1 = false;
	bool func2 = false; 
	vec2 co = gl_FragCoord.xy;
	vec3 clr = vec3(0.0,0.0,1.0);
	float strichH = resolution.y/2.0;
	float strichV = resolution.x/2.0;
	if( abs(strichH -co.y) <coordWidth)
	{
		clr.r = 1.0;
	}
	if( abs(strichV -co.x) <coordWidth)
	{
		clr.r = 1.0;
	}
	
	float y = func((co.x-resolution.x/2.0)/scale)*scale;
	float y2 = funcB((co.x-resolution.x/2.0)/scale)*scale;
	if( abs((co.y-resolution.y/2.0) -y) < width)
	{
		clr.g = 1.0;
		func1 = true;
	}
	if( abs((co.y-resolution.y/2.0) -y2) < width)
	{
		clr.g = 0.5;
		clr.g = 0.5;
		func2 = true;
	}
	if (func1 == func2 && func2 == true)
	{
		clr.r = 0.0;
		clr.g = 0.0;
		clr.b = 0.0;
	}
	
	gl_FragColor = vec4( clr/2.0,1.0 );

}
