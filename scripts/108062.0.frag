#define topart
#define angle 3.14159/7.;
#define constant vec2(1.1)


#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

uniform sampler2D backbuffer;

vec3 hsv(float h,float s,float v) {
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}
vec2 cmul(vec2 a, vec2 b) {
    return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

vec2 cdiv(vec2 a, vec2 b) {
    return vec2(a.x*b.x + a.y*b.y, a.y*b.x - a.x*b.y) / dot(b, b);
}

vec2 mobius(vec2 z, vec2 a, vec2 b, vec2 c, vec2 d) {
    return cdiv(cmul(a, z) + b, cmul(c, z) + d);
}

void main( void ) 
{
	float t = 49.5 + 0.5 * sin(time);
	vec2 p = 5.*surfacePosition;
	p = vec2(-p.y,p.x);         // rotate 90° 
	p = p *(7. - 6.*mouse.y);  // alternate  zoom
	p /= dot(p,p);
	float a = angle;
	float s = sin(a+0.03*t);
	float c = cos(a-0.05*t);
	vec3 col = vec3(time/20.0 + sin(t/2000.)*cos(t/2000.));
	for (int i = 0; i < 200; i++) 
	{	if (dot(p, p) > 4.0) 
		{   col *= 4.0; 
		    break;
		}
		p = cmul(p, p) + p * constant;
		p = -abs(p);
		p = vec2(-s*p.y+c*p.x, s*p.x+c*p.y);
		p = -abs(p.yx);
		col += hsv(dot(p,p)*2.0, 0.9, 89.);
	}
	gl_FragColor = vec4( sin(col), 1.0 );
	
	for(float ix = -1.; ix < 1.1; ix += 1.0001)
	for(float iy = -1.; iy < 1.1; iy += 1.0001)
	{
		vec2 coord = (gl_FragCoord.xy+vec2(ix, iy))/resolution;
		vec4 sample = texture2D(backbuffer, coord);
		float relevance = (-0.5)/(1.+dot(sample, gl_FragColor));
		//relevance /= (1.0+ix*ix+iy*iy);
		//relevance = 0.1/relevance;
		//sum_relevance += relevance;
		//sum_color += relevance*sample;
		gl_FragColor = max(gl_FragColor, sample*.5-1./256.);
	}
}