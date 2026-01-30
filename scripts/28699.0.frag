#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define WIDTH .25

float point(vec2 p)
{
	return 1.-clamp(dot(length(p)-WIDTH/32., resolution.x * WIDTH), 0., 1.);	
}

float ring(vec2 p, float r)
{
	return 1.-clamp(dot(abs(length(p)-r), resolution.x * WIDTH), 0., 1.);
}

float line(vec2 p, vec2 a, vec2 b)
{
	if(a == b) return 0.;
	
	float d = distance(a, b);
	vec2  n = normalize(b - a);
    	vec2  l = vec2(0.);

	p	-= a;
	d	*= -.5;
	
	l.x 	= abs(dot(p, vec2(-n.y, n.x)));
	l.y 	= abs(dot(p, n.xy)+d)+d;
	l 	= max(l, 0.);
	
	return  1.-clamp(dot(resolution * WIDTH, l), 0., 1.);
}


mat2 rmat(float t)
{
    float c = cos(t);
    float s = sin(t);   
    return mat2(c,s,-s,c);
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec2 p 	= (uv * 2. - 1.) * resolution.xy/resolution.yy;
	vec2 m  = tan(sin(time*0.51)*2. - cos(surfacePosition*4.)) * resolution.xy/resolution.yy;
	
	
	float l = 0.;
	float r = 0.;
	float d = 0.;
	
	r += ring(p, .5);
	for(int i = 0; i < 8; i++)
	{
		l += line(p, vec2(0.), m) + line(p - .5 * normalize(m),vec2(0.), vec2(-m.y, m.x));
		r += ring(p / vec2(-m.y, m.x), abs(m.y)/abs(m.x));
		d += point(p) + point(p-m) + point(p-.5 * normalize(m)) + point(p - .5 * normalize(m) - vec2(-m.y, m.x));
		p *= rmat(float(7-i)*3.*atan(1.));
	
	}
	
	
	gl_FragColor = vec4(d + l + r);
}//sphinx