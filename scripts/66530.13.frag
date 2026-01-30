#ifdef GL_ES
precision	highp	float;
#endif
//#extension GL_OES_standard_derivatives : enable
uniform	float	time;
varying	vec2	surfacePosition;
vec2 hash2(vec2 uv1)
{
return fract(sin(mat2(15.23, 35.48, 74.26, 159.37)*uv1)*47658.23);
}
void	main(void)
{
	gl_FragColor = vec4(0.0,0.0,0.0,1.0);
vec2 uv = surfacePosition.xy;
uv *= sin(length(uv)*64.0-time*16.0)/pow(1.0+length(uv),2.0)+16.0;
vec2 gg = floor(uv);
vec2 ff = fract(uv);
float dd = 1.0;
for(int i=-1;i<=1;i++)
{
	for(int j=-1;j<=1;j++)
	{
		vec2 bb = vec2(i, j);
		vec2 vv = bb + hash2(gg + bb)-ff;
		dd = min(dd, dot(vv,vv));
	}
}
float c1 = 0.1/sqrt(dd);
float r = c1*(1.1+sin(time*3.0+uv.y+uv.x*4.0));
float g = c1*(0.8+cos(time-uv.y*1.5));
float b = c1*(0.7+sin(time*0.5+uv.x*3.30));
	gl_FragColor.xyz = vec3(1.0);
gl_FragColor.x=r;
gl_FragColor.y=g;
gl_FragColor.z=b;
gl_FragColor.w=0.3;
}




