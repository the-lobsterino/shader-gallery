#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
vec3 a(float b,vec3 c)
{
	vec3 d=vec3(3,2,1),e=vec3(0,1,0),f=normalize(vec3(sin(b),1,cos(b)));
	float g=max(.0,dot(c,f));
	return (pow(g,256.)+.2*g*g)*d*2.+max(.0,-dot(c,e))*2.*d+max(.0,dot(c,e))*d.zyx;
}

void main(void)
{
	vec2 h=resolution;
	vec3 i=vec3(0,0,-3),c=normalize(vec3((-1.+2.*gl_FragCoord.xy/h.xy)*vec2(h.x/h.y,1),1));
	float j=dot(c,i);
	float k=j*j+1.-dot(i,i);
	float l=-j-sqrt(abs(k));
	float b=mix(-1.,l,step(.0,min(l,k)));
	float m=time;
	vec3 n=normalize(i+c*b);
	vec3 o=a(m,c);
	vec3 p=a(m,reflect(c,n));
	gl_FragColor=vec4(mix(o,p*.5,step(.0,b))*.1,1);
}