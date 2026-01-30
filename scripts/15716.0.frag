#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
float t=time*.5;
float m(vec3 p)
{
	p=abs(p);
	return max(p.x-4.,max(p.y-.5,p.z-.7))*.47;
}
vec2 r(vec2 p)
{
	float a=mod(sin(p.y)*cos(p.x),1.7)-.85;
	return vec2(cos(a),sin(a))*length(p);
}
float f(vec3 p)
{
	p.xz*=mat2(sin(t),cos(t),-cos(t),sin(t));
	p.xz=r(p.xz);
	p.yz=r(p.yz);
	p.xy=r(p.xy);
	return (m(p));
}
void main(void)
{
	
	if (mod(gl_FragCoord.x, 2.0) < 1.0) gl_FragColor = vec4(0,0,0,1);
	else {
		vec2 uv=gl_FragCoord.xy/resolution.yy-vec2(1.,.5);
		vec3 p=vec3(uv/t,-5.),d=vec3(uv,.5);
		for(int i=0;i<96;i++)
		{
			p+=d*f(p);
		}
		gl_FragColor = vec4(min(pow(f(p-d),.3),1.)-length(uv)*.3) * (1.0 - 4.*uv.y*uv.y)*(1.0 - uv.x*uv.x);
	}
}