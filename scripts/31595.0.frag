#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define WIDTH .20



float ring(vec2 p, float r)
{
	return 1.-clamp(dot(abs(length(p)-r), resolution.x * WIDTH), 0., 1.);
}




mat2 rmat(float t)
{
    float c = cos(t);
    float s = sin(t);   
    return mat2(c,s,-s,c);
}

void main( void ) {

	vec2 uv,p,m;
	 uv = gl_FragCoord.xy/resolution.xy;
	 p 	= (uv * 2. - 1.) * resolution.xy/resolution.yy;
	 m  = (mouse* 0.5 - 2.) * resolution.xy/resolution.yx;
	
	
	float l=0.,r=0.,d=0.; //only the last one was initialized so i got garbage, why the edit?
	
	
	for(int i = 0; i < 8; i++)
	{
		
		r += ring(p / vec2(-m.y, m.x), abs(m.y)/abs(m.x));
		p *= rmat(float(7-i)*5.*atan(1.));
	
	}
	
	
	gl_FragColor = vec4(d + l + r);
}//sphinx