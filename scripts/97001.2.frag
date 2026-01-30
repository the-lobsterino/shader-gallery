// whirlpool
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float time;
uniform vec2 resolution;

#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))		
#define A(u,w) 	k=length(p.xy);p.x=k*(mod(atan(p.y,p.x),2.*3.14/u)-3.14/u);p.y=k-w		
#define B(u) 	k=length(p.yz);p.y=k*(mod(atan(p.z,p.y),2.*3.14/u)-3.14/u);p.z=k		
float random(vec2 pos) {  return fract(sin(pos.x*1399.9898+pos.y*78.233) * 43758.5453123); }

void main( void ) {
	vec2 m = vec2(.4,sin(time/4.)/10.+.024);
	vec2 uv = (.5*resolution-gl_FragCoord.xy)/resolution.y; 
	vec3 rd = normalize(vec3(uv, 1)), q = vec3(0,0,-180.), p; 
	gl_FragColor = vec4(0,.3,.7,1);
	for (float i = 1.; i < 90.; i++) {
		float k;
		p=q;
		p.yz *= rot(m.y*10.);
		p.xz *= rot(time*20.+sqrt(length(p))*m.x*4.); 	
		B(1.);	
		A(16.,11.); 
		B(2.2+sqrt(abs(p.z))/24.);
		float h=time*38.+length(p); 
		vec4 white=vec4(vec3(.125,.35,.5)+random(p.xy),1);
		float d = abs(p.x)+abs(p.y)+(p.z)-length(p)-38.*sin(h)*length(p)/345.; 
		if (d < 0.01 ) { gl_FragColor+= white/i*10.; break; }
		q += rd * d/(1.+length(p)/800.)/4.;	
	}
}