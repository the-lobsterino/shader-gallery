#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265358979323846

//
//this is original work test
//

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 blue = vec3(0.0,0.0,0.9);

//translate2D
void translate2D(inout vec2 uv,in vec2 offset)
{
	uv += offset;
}
//rotate
//angle is degree
void rotate2D(inout vec2 uv,in float angle,in vec2 offset)
{
	uv -= offset;
	uv =  mat2(cos(angle),-sin(angle),sin(angle),cos(angle)) * uv;
	uv += offset;
}
//scale2D
void scale2D(inout vec2 uv,in vec2 scale)
{
	uv *= scale;		
}

//create circle
//size is (widthNum , heightNum)
void circle(inout vec2 uv,in vec2 center,in float radius)
{
	float distance = length(uv - center);
	uv = vec2(step(distance,radius),step(distance,radius));
}
//create tile
void tile(inout vec2 uv,in vec2 size)
{
	uv *= size;
	uv = fract(uv);
}
//create block tile
//size is (widthNum , heightNum)
//isOffset is width or height(true:1.0 , false:0.0)
void blockTile(inout vec2 uv,in vec2 size,in vec2 isOffset)
{
	uv *= size;
	//tile is offset
	uv.x += step(1.0,mod(uv.y,2.0)) * 0.5 * isOffset.x;
	uv.y += step(1.0,mod(uv.x,2.0)) * 0.5 * isOffset.y;
	uv = fract(uv);
}
void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec3 color = vec3(0.0);
	
	//scale
	scale2D(uv,vec2(sin(time + 0.5) * 1.5));
	//rotate
	rotate2D(uv,time * 0.5,vec2(0.5));
	//translate
	translate2D(uv,vec2(time,0.0));
	
	//calc
	//tile(uv,vec2(3.0));
	blockTile(uv,vec2(5.0),vec2(1.0,0.0));
	circle(uv,vec2(0.5,0.5),0.2);
	
	//color
	color = vec3(uv,0.0) * sin(time) + 0.2;
	//this is color change
	color.x = 2.0 * sin(time * 0.8) + 0.2;
	gl_FragColor = vec4(color,1.0);
}