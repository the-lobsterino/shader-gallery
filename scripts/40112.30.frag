#extension GL_OES_standard_derivatives : disable


precision highp float;



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float clampa(float x, float minVal, float maxVal)
{
return min(max(x, minVal), maxVal);
}

float smoothstepa(float edge0,float edge1, float x)
{
	
  float t;  /* Or genDType t; */
    t = clampa((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

float loga(float x)
{
	if (x<=0.)
		return log(-x);
	
	return log(x);
	
}

float cosa(float x)
{
	float p2 = 2.0*3.1415926536;
	
	if (x > p2)
	{	
		float n = floor(x / p2);
		x = x - n*p2;		
	}
	
	return cos(x);
}

float powa(float x, float y)
{
	if (x<=0.0)
		return -1e10;//pow(-x, y);
	
	return pow(x,y);
}

void main( void ) 
{
  vec2 p = 2. * ((gl_FragCoord.xy / resolution.y) * 2.0 - 1.0);
  p = 0.8 + mod(p,-1.6);                   // mirrors
  float d = length(p);                     // distance
  float a = 7.0e0+ time + 3.0 * atan(p.x, p.y);   // angle
  float r = 0.5 + .2 * pow(cos(a), 0.08);//exp(loga(cosa(a)) * 0.08); // radius 0.08
  float f = smoothstep(d*1.0, 1.0*d+0.012, r);     // aa
  vec3 col = mix(vec3(0.5), vec3(0.0, 0.9, 0.0), f);
  gl_FragColor = vec4 ( col, 1.0);
}