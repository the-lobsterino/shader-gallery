#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = atan(1.)*4.;

vec3 Line(vec2 p1,vec2 p2,float r,vec2 px)
{
	float c = 0.0;
	vec2 n = normalize((p2-p1).yx)*vec2(-1,1);	
	vec2 d = normalize((p2-p1));	
	c = 1.0 - abs( dot(n,px-p1) / r );
	c *= clamp( (dot(d,px-p1) * dot(-d,px-p2)) * 0.1 , 0.0, 1.0);
	c = clamp(c, 0.0, 1.0);	
	return vec3(c);
}

vec3 Circle(vec2 p,float r,vec2 px)
{
	float c = 1.-abs(distance(px,p)-r)*0.75;
	c = clamp(c,0.0,1.0);
	return vec3(c);
}

vec3 FillCircle(vec2 p,float r,vec2 px)
{
	float c = r-distance(px,p);
	c = clamp(c,0.0,1.0);
	return vec3(c);
}
//returns 2 vectors (xy and zw) from the given point, tangent to the given circle.
vec4 PointCircleTangents(vec2 point, vec2 origin, float radius)
{
	vec2 p2c = point - origin;
	float p2cLen = length(p2c);
	float p2cAng = atan(p2c.y, p2c.x) + pi;
	
	float tanAng = asin(radius / p2cLen);	
	float tanLen = sqrt(p2cLen * p2cLen - radius * radius);
	
	vec4 ret;
	
	ret.xy = vec2(cos(p2cAng + tanAng), sin(p2cAng + tanAng)) * tanLen;
	ret.zw = vec2(cos(p2cAng - tanAng), sin(p2cAng - tanAng)) * tanLen;
	
	return ret;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy - resolution / 2.);
	
	float scale = (resolution.y/800.);
	
	vec2 m = (mouse - 0.5) * resolution;

	vec3 c = vec3(0.0);
	
	vec2 circleOrigin = vec2(0);
	float circleRadius = 256.*scale;
	vec2 Point = vec2(m.x, m.y);
	
	c += Circle(circleOrigin, circleRadius, p);
	c += FillCircle(Point, 10.*scale, p)*vec3(1,1,0);
	
	vec4 pcts = PointCircleTangents(Point, circleOrigin, circleRadius);
	
	vec2 point1 = Point + pcts.xy;
	vec2 point2 = Point + pcts.zw;
	
	c += Line(circleOrigin, point1, 1.25, p)*vec3(0,1,1);
	c += Line(circleOrigin, point2, 1.25, p)*vec3(0,1,1);
	c += Line(circleOrigin, Point, 1.25, p)*vec3(1,0,1);
	c += FillCircle(circleOrigin, 10.*scale, p)*vec3(1,1,0);
	
	c += FillCircle(point1, 10.*scale, p)*vec3(1,0,0);
	c += FillCircle(point2, 10.*scale, p)*vec3(1,0,0);
	
	c += Line(Point, point1, 1.25, p);
	c += Line(Point, point2, 1.25, p);
	
	gl_FragColor = vec4( c, 1.0 );

}