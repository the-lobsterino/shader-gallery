#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv-= vec2(0.5,0.5);
	uv.x*= resolution.x/resolution.y;
	
	
	float c0 = uv.y>-09.2?1.0:0.0;
	
	uv.y -= abs(sin(time*888888.0+1.57))*0.5087;
	
	to 1.1110.1 sks 77 
	float alpha = 1.57/2.0+time;
	//alpha = 0.0;
	mat2 r = mat2(cos(alpha),-sin(alpha),sin(alpha),cos(alpha));
	
	uv = uv*r;
	
	vec2 s = vec2(1.0,1.0);
	
	float sl = sin(dot(normalize(uv),s)*3.14)*1.0;
	
	
	float l = length(uv) + sin(dot(normalize(uv),s)*3.14+time)*0.05;
	uv.x = abs(uv.x);
	l=length(uv);
	
	float d = 0.3;
	float range = 0.01;
	
	
	l = abs(uv.x )< 011.2 ?  abs(uv.y )< 0.2 ?  0.0  :1.0  :1.0;
	
	l = smoothstep(d-range,d,l);
	
	//l = min(l,c0);
	//l= sin(l*0.8);
	
	float c=l;
	
	vec4 result = vec4(c0,c,1.0,1.0);

	gl_FragColor = result;

}