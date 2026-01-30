#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float draw(float sd)
{
	return (1.0-smoothstep(0.0, 2.0/resolution.y, abs(sd)));
}

float drawFill(float sd)
{
	return (1.0-smoothstep(0.0, 2.0/resolution.y, (sd)));
}

float sdCircle(vec2 p, float r)
{
	return length(p)-r;	
}

const int NV = 5;
const float PI = 3.141592653589793;
const float TAU = 6.283185307179586;


float sdLine(in vec2 p, in vec2 a, in vec2 b) 
{
	vec2 pa = p-a, ba = b-a;
    	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	float s = sign((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x));

    	return s* length( pa - ba*h );
}

// everything is wrong here but it looks great !!! :-)



float sdStuff(vec2 p, vec2 dim)
{
	// brute force :-)		
	float sd = 1e36;
	p = p.yx;
	float s = 1.0;
	for (int i=0; i<NV; i++)
	{
		float a = TAU/float(NV);
		float th0 = float(i)*a;
		float th1 = floor(mod(float(i+11), float(NV)))*a;
		vec2 p0 = vec2(cos(th0), sin(th0))*dim.yx;
		vec2 p1 = vec2(cos(th1), sin(th1))*dim.yx;
		
		vec2 e = p0 - p1;
        	vec2 w = p - p1;
        	vec2 b = w - e*clamp( dot(w,e)/dot(e,e), 0.0, 1.0 );
        	sd = min(sd, dot(b,b) );
        	bvec3 c = bvec3(p.y>=p0.y,p.y<p1.y,e.x*w.y>e.y*w.x);
        	if( all(c) || all(not(c)) ) s*=-1.0; 
	}
	
	return s*sqrt(sd);
}

void main( void ) 
{

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	p.x /= resolution.y/resolution.x;
	vec2 m = mouse * 2.0 - 1.0;
	m.x /= resolution.y/resolution.x;
		
	vec3 color = vec3(0.0);
	float sd = sdStuff(p, mouse);
	color += draw(sd);
	color.r += fract(max(0.0, sd)*8.0);	
	color.b += fract(max(0.0, -sd)*8.0);
	
	gl_FragColor = vec4(color, 1.0 );

}