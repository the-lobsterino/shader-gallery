#ifdef GL_ES
precision mediump float; 
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

// 2D Lighted Flower Shape 
//    https://www.shadertoy.com/view/XsByzm

// use the code and tricks of shane's shader
// 'Rounded Voronoi Borders' https://www.shadertoy.com/view/ll3GRM

#define circleRadius 2.0
#define maxRadius 4.0
#define petalThickness 2.6
#define petalCount 9.0
#define flowerThickness 2.2
#define lightAmount 12.
const vec3 color1 = vec3(0.1,0.20,0.5);
const vec3 color2 = vec3(0.0,0.01,0.4);

float df(vec2 p)
{
	float flower = (0.4+0.4*sin(time))*maxRadius - petalThickness * cos(atan(p.x,p.y) * petalCount) - dot(p,p);
	float disk = 0.3*(circleRadius - dot(p,p));
	return max(disk*8., flowerThickness - abs(flower));
}

vec2 hMap(vec2 uv)
{
    	float h = df(uv*6.);
    	float c = smoothstep(0., fwidth(h)*5., h)*h;
    	return vec2(c, h);
}

void main()
{
	vec2 uv = surfacePosition;
    	vec2 c = hMap(uv);
    	vec2 d = hMap(uv + vec2(cos(time),sin(time))*0.01);
    	float b = max(d.x - c.x, 0.0) * lightAmount;
    	vec3 col = color1*c.x + color2*(b*b*0.04 + b*b*b*b*0.07);
	gl_FragColor = vec4(sqrt(col), 1);
}