//ziad 2018

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define PI 3.14159265

void rotate2D (inout vec2 vertex, float rads)
{
  mat2 tmat = mat2(cos(rads), -sin(rads),
                   sin(rads), cos(rads));
 
  vertex.xy = vertex.xy * tmat;
}

float sdTriangle( in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2 )
{
    vec2 e0 = p1-p0, e1 = p2-p1, e2 = p0-p2;
    vec2 v0 = p -p0, v1 = p -p1, v2 = p -p2;

    vec2 pq0 = v0 - e0*clamp( dot(v0,e0)/dot(e0,e0), 0.0, 1.0 );
    vec2 pq1 = v1 - e1*clamp( dot(v1,e1)/dot(e1,e1), 0.0, 1.0 );
    vec2 pq2 = v2 - e2*clamp( dot(v2,e2)/dot(e2,e2), 0.0, 1.0 );
    
    float s = sign( e0.x*e2.y - e0.y*e2.x );
    vec2 d = min(min(vec2(dot(pq0,pq0), s*(v0.x*e0.y-v0.y*e0.x)),
                     vec2(dot(pq1,pq1), s*(v1.x*e1.y-v1.y*e1.x))),
                     vec2(dot(pq2,pq2), s*(v2.x*e2.y-v2.y*e2.x)));

    return -sqrt(d.x)*sign(d.y);
}

float sdAnnularShape( in vec2 p, in float r )
{
  return abs(sdTriangle(p, vec2(0.9,0.4),vec2(.5,.7), vec2(0.3,.2))) - r;
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}


void main( void ) {

	
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	
	p.x /= resolution.y/resolution.x;
	
	rotate2D(p, (-2.0*PI/12.0) );
	
	vec2 p2 = vec2((p.x - 0.5)*2.0, (p.y - 0.5)*2.0);
	float x = p.x;
	
	float t = atan(p.y,p.x);
	
	float h = t / (2.0* PI) * 6.0;
	
	
	rotate2D(p, floor(2.0+h)*(-2.0*PI/6.0) );
	p-=smin(sdAnnularShape(p,0.2)*(cos(time*2.2)*sin(time*2.2)),sdAnnularShape(p,0.8), .5);
	p+=smoothstep(.2,.4,atan(cos(p*time)));
	p-=smoothstep(.5,.9,fract(sin(p)));
	
	float dy = 1./ ( 50. * abs(length(p.y) - 0.3));
	
	gl_FragColor = vec4( (x + 0.2) * dy, 0.5 * dy, dy, 1.0 );

}