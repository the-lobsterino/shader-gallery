
precision highp float;


#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(){
	
	vec2 mouse_M = abs(-1.0 + 2.0 * mouse.xy);
	//vec2 mouse_M = 0.001 * vec2(0.0,0.5);
	
	mouse_M.x *= 0.1;
	mouse_M.y *= 0.1;
	
	//mouse_M *= pow(time, 0.2);
	
	vec2 mod = 0.1 * mouse_M * pow(time * 1.0, 0.55);
	//vec2 mod = mouse_M * (time * 0.06);
	
	vec3 p = vec3((gl_FragCoord.xy)/(resolution.y), mod.y) + vec3(-1.0, -0.5, 0.0);
	
	vec3 b = vec3((gl_FragCoord.yz)/(resolution.y), 0.5) ;
	
	
	for (int i = 0; i < 10; i++)
	{
		p.xyz = (abs((abs(p)/dot(p,p)-vec3(mod.x,1.0, mod.x * 0.2))));
	}
	
	for (int i = 0; i < 10; i++)
	{
		b.xzy = (abs((abs(p)/dot(p,p)-vec3(1.0,1.0,0.0))));
	}
	
	for (int i = 0; i < 30; i++)
	{
		p.zyx = (abs((abs(p)/dot(p,p)-vec3(1.0,1.0,b.z))));
	}
	
	vec3 c = abs((abs(p)/dot(b,b)-vec3(1.0,1.0, p.x)));
	
	gl_FragColor.xyz = c;
	
}