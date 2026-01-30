#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//
//this is all tutorial
//https://thebookofshaders.com/09/?lan=jp
//

#define PI 3.14159265358979323846

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//translate2D
void translate2D(inout vec2 uv,in vec2 offset)
{
	uv += offset;	
}
//rotate2D
void rotate2D(inout vec2 uv,in float angle,in vec2 offset)
{
	uv -= offset;
	uv = mat2(cos(angle),-sin(angle),sin(angle),cos(angle)) * uv;
	uv += offset;
}
//scale2D
void scale2D(inout vec2 uv,in vec2 scale)
{
	uv *= scale;	
}
//create tile
void tile(inout vec2 uv,in vec2 size)
{
	uv *= size;
	uv = fract(uv);
}
//rotate tile pattern
void rotateTilePattern(inout vec2 uv)
{
	uv *= 2.0;
	float index = 0.0;
	index += step(1.0,mod(uv.x,2.0));
	index += step(1.0,mod(uv.y,2.0)) * 2.0;
	
	//      |
   	//  2   |   3
    	//      |
    	//--------------
    	//      |
    	//  0   |   1
    	//      |
	
	//make each cell between 0.0 - 1.0
	uv = fract(uv);
	//rotate each cell according to the index
	if(index == 1.0)
	{
		rotate2D(uv,PI * 0.5,vec2(0.5));
	}
	else if(index == 2.0)
	{
		rotate2D(uv,PI*-0.5,vec2(0.5));
	}
	else if(index == 3.0)
	{
		rotate2D(uv,PI,vec2(0.5));
	}
}
//circle
void circle(inout vec2 uv,in vec2 center,in float radius)
{
	vec2 dis = uv - center;
	uv = vec2(1.0-smoothstep(radius - (radius*0.01),radius + (radius*0.01),dot(dis,dis) * 4.0));
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec3 color = vec3(0.0);
	
	tile(uv,vec2(3.0));
	rotateTilePattern(uv);

	//make more interesting combinations
	tile(uv,vec2(2.0));
	rotate2D(uv,-PI*time * 0.25,vec2(0.5));
	rotateTilePattern(uv);
	rotate2D(uv,PI * time * 0.25,vec2(0.5));
	
	//make color
	//color = vec3(step(uv.x,uv.y));
	color = vec3(uv,1.0);
	gl_FragColor = vec4(color,1.0);
}