#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float time;
uniform vec2 mouse, resolution;

#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))
//#define A(u,w) 	k=length(p.xy);p.x=k*(sin(mod(atan(p.y,p.x),3.14))*(sin(p.x))-1.)/u;p.y=k-w		
#define A(u,w) 	k=length(p.xy);p.x=k*(mod(atan(p.y,p.x),2.*3.14/u)-3.14/u);p.y=k-w		
#define B(u,w) 	k=length(p.yz);p.y=k*(mod(atan(p.z,p.y),2.*3.14/u)-3.14/u);p.z=k-w		

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - .5*resolution)/resolution.y;
	vec3 rd = normalize(vec3(uv, 1)), q = vec3(0,0, -280.), p; 
	gl_FragColor = vec4(1);
	for (float i = 1.; i < 70.; i++) {
		float k;
		p=q;
		p.yz *= rot(mouse.y*3.); 
		p.xz *= rot(mouse.x*3.); 
	
		A(8.,0.);
		B(2.,132.);
		A(4.*(1.1+cos(time/4.)),2.);
		B(22.,25.);
		float d = abs(p.x)+abs(p.y)+(p.z)-length(p)-1.; 
		if (d < 0.1) {
			if(abs(p.z)<5.+320.) gl_FragColor = vec4(p.z/p.y);		
			break;
		}
		q += rd * d;
	}
}