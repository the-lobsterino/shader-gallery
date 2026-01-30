// more 4 u
#ifdef GL_ES
precision mediump float;
#endif
 
//#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 resolution;
 
void main(void)
{
	gl_FragColor = vec4(0.99885);
	vec2 uv = (2.0*gl_FragCoord.xy-resolution.xy)/max(resolution.x,resolution.y);
 	float d = length(uv);
	d -= sin(time*0.3+uv.y*0.5)*0.4;
	float a = time*-0.4+atan(uv.x,uv.y);
	uv.y *= 1.8+sin(d+time+uv.x*5.17)*1.15;
	uv.x *= 1.5-sin(d-time+uv.y*4.61)*1.05;
	uv = sin(time*2.2+uv+a*3.0);
	vec4 cc = vec4(.85+sin(d*22.0+a*6.0+uv.y*2.4+d*31.0+uv.x*3.3+time*1.5+uv)*1.35, 0.8+sin(d*18.0+a*5.0+uv.x*4.3+uv.y*2.7+time*2.2+uv)*1.15);
	float v = length(cc);
	vec3 col = vec3((v*v)*0.14);
	
	col.x *= (0.9-sin(d*10.0+time*3.3)*0.3);
	col.y *= (0.7-sin(d*6.0+time*2.3)*0.1);
	col.z *= .67;
	col *=0.01;
	gl_FragColor.xyz = (0.005/col)*0.5;
}

