#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 	toworld(vec2 p);
float 	line(vec2 p, vec2 a, vec2 b, float w);
mat2 	rmat(float t);

void main( void ) {

	vec2 uv		= gl_FragCoord.xy / resolution.xy;
	uv		= toworld(uv);
	
	vec2 m		= toworld(mouse);
	
	float c		= step(length(m-uv),.03);

	float l		= line(uv, m, normalize(m), .01);
	
	
	gl_FragColor = vec4(0., l, c, 1.);

}

vec2 toworld(vec2 p)
{
	p = p * 2. - 1.;
	p.x *= resolution.x/resolution.y;
	return p;
}

float line(vec2 p, vec2 a, vec2 b, float w)
{
	if(a==b)return(0.);
	float d = distance(a, b);
	vec2  n = normalize(b - a);
    vec2  l = vec2(0.);
	l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
	return clamp(smoothstep(w, 0., l.x+l.y), 0., 1.);
}

mat2 rmat(float t)
{
    float c = cos(t);
    float s = sin(t);   
    return mat2(c,s,-s,c);
}