#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define SMOOTH(r, R) (1.0 - smoothstep(R - 1.0, R + 1.0, r))
#define RANGE(a,b,x) ( step(a,x)*(1.0-step(b,x)) )
#define RS(a,b,x) ( smoothstep(a-1.0,a+1.0,x)*(1.0-smoothstep(b-1.0,b+1.0,x)) )
#define M_PI 3.1415926535897932384626433832795

#define blue0 vec3(0.0274, 0.149, 0.231)
#define blue1 vec3(0.74,0.95,1.00)
#define blue2 vec3(0.87,0.98,1.00)
#define blue3 vec3(0.35,0.76,0.83)
#define blue4 vec3(0.953,0.969,0.89)
#define red   vec3(1.00,0.38,0.227)
#define green vec3(0.258, 0.647, 0.211)

#define MOV(a,b,c,d,t) (vec2(a*cos(t)+b*cos(0.1*(t)), c*sin(t)+d*cos(0.1*(t))))


vec3 	u_backgroundColor = vec3(0);
vec2 	u_displayResolution = vec2(500);  	// viewport resolution (in pixels)
float 	u_scaleField = 1.0;   			// scale (zoom) 
vec2 	u_translateField = vec2(-400, 10);	// move field
float 	u_time = 0.5;

//out vec4 out_fragColor; 

vec4 createQuater(vec3 rotateAxis, float angle)
{
    float halfSin = sin(angle / 2.0);
    return vec4(rotateAxis.x * halfSin,
		rotateAxis.y * halfSin,
		rotateAxis.z * halfSin,
		cos(angle / 2.0));
}

vec3 rotate(vec4 quat, vec2 pos)
{
   vec3 pos3 = vec3(pos, 0.0);	
	
   vec3 temp = cross(quat.xyz, pos3) + quat.w * pos3;
   return pos3 + 2.0 * cross(quat.xyz, temp);
}

float myline(vec2 p1, vec2 p2)
{
	vec2 uv = gl_FragCoord.xy + u_translateField;
	float a = abs(distance(p1, uv));
	float b = abs(distance(p2, uv));
	float c = abs(distance(p1, p2));
	
	if (a >= c || b >= c)
		return 0.0;
	
	float p = (a + b + c) * 0.5;
	float h = 2.0 / c * sqrt(p * (p - a) * (p - b) * (p - c));
//	return mix(1.0, 0.0, smoothstep(0.0, 1.0, h));
	return SMOOTH(h, 0.5);
}

float movingLine(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;	
    float r = sqrt(dot(d, d));
    if (r > radius)
	return 0.0;
    
    //angle of the line	
    float theta0 = 90.0 * u_time;
    vec2 rotateVec = vec2(0.0, radius);
    rotateVec = rotate(createQuater(vec3(0,0,-1), radians(theta0)), rotateVec).xy;
    float l = myline(center, center + rotateVec);			    
    
    //compute gradient based on angle difference to theta0	
    float theta = mod(degrees(-atan(d.x, d.y)) + theta0, 360.0);
    float gradient = clamp(1.0 - theta / 90.0, 0.0, 1.0);
    return l + 0.3 * gradient;		
}

float circle(vec2 uv, vec2 center, float radius, float width)
{
    float r = length(uv - center);
    float halfWidth = width / 2.0;
    return SMOOTH(r - halfWidth, radius) -
           SMOOTH(r + halfWidth, radius);
}

float _cross(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
    int x = int(d.x);
    int y = int(d.y);
    float r = sqrt( dot( d, d ) );
    if( (r<radius) && ( (x==y) || (x==-y) ) )
        return 1.0;
    else return 0.0;
}


void createCircles(vec2 uv, vec2 center, int circlesCount, float radius, float width, out vec3 finalColor)
{
    float stepRadius = radius / float(circlesCount);
    for (int i = 1; i <= 8; ++i)
    {
	float currentRadius = float(i) * stepRadius;
        finalColor += circle(uv, center, currentRadius, 1.0) * blue1;
    }
} 


void main()
{
    vec3 finalColor;

    vec2 uv = gl_FragCoord.xy;
    uv += u_translateField;
    uv *= u_scaleField;  

    //center of the image
    vec2 center = vec2(u_displayResolution) / 2.0;

    float radius = center.x;	
    int circlesCount = 8;
    float widghtLine = 1.0;	
    createCircles(uv, center, circlesCount, radius, widghtLine, finalColor);    

    //cross lines
//    finalColor += vec3(0.3 * _cross(uv, center, radius));
    vec2 offsetLine = vec2(0.0, 250.0);	
    for (int i = 0; i < 12; ++i)
    {
	float alpha = radians((30.0));
	offsetLine = rotate(createQuater(vec3(0,0,-1), alpha), offsetLine).xy;	
	finalColor += myline(center, center + offsetLine) * blue1;
    }		

    //ray
    finalColor += movingLine(uv, center, radius) * green;
	
    gl_FragColor = vec4(finalColor + u_backgroundColor, 1.0);
}

