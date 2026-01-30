#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
	float t=.001;
	vec3 v = vec3(t);
	vec3 pos=vec3(-resolution.x/2.0,-resolution.y/2.0,0);
	
	float a1 = 0.6 + time*.3;
	mat2 rot1 = mat2(cos(a1),-sin(a1),sin(a1),cos(a1));
	//pos.yx *= rot1;
	
	for (float s=0.; s<1.; s+=.015) {
		vec3 p=s*(gl_FragCoord.xyz+pos)*t+vec3(.1,.4,fract(0.15*s+(time*20.)*.005));
		p.xy *= rot1;
		for (int i=0; i<6; i++) p=abs(p)/dot(p,p)-(0.8);
		v+=4.9*dot(p,p)*t*vec3(s,s*s,4.*s*s*s*s*s*s);
	}
	gl_FragColor=vec4(v.rgb, 1.0);
}