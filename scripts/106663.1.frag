
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.14159265359
#define TWO_PI 6.28318530718

float triangleArea(vec2 a, vec2 b, vec2 c) 
{ 
   a = ceil(a * 10000.0); b = ceil(b * 10000.0); c = ceil(c * 10000.0);
   return abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2.0); 
}

bool insideRect(vec2 a, vec2 b, vec2 pt)
{
    return pt.x >= a.x && pt.y >= a.y && pt.x <= b.x && pt.y <= b.y;
}

bool insideTri(vec2 a, vec2 b, vec2 c, vec2 pt) 
{    
   float A = triangleArea(a, b, c); 
   float A1 = triangleArea(pt, b, c); 
   float A2 = triangleArea(a, pt, c); 
   float A3 = triangleArea(a, b, pt); 
   return A == A1 + A2 + A3;
}


vec4 palestine(vec2 coord)
{

     if(!insideTri(vec2(0, 0), vec2(0, 1), vec2(1.0/2.5, 1.0/2.0), coord))
    {
        if (coord.y < 1.0/3.0)
            return vec4(0,0,0,1);
        else if((coord.y > 1.0/3.0)&&(coord.y < 1.0/1.50))
		return vec4(1,1,1,1);
            return vec4(0,0.5,0,1);
    }
	
		//if(insideRect(vec2(1.0/3.77, 1.0/3.0), vec2(1, 2.0/3.0), coord)){
		//return vec4(1,1,1,1);}
    return vec4(0.75,0,0,1);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;
	position.y=1.0-position.y;

	

	gl_FragColor = palestine(position);

}