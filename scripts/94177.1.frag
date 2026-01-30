#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float time;
uniform vec2 mouse, resolution;

#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))
//#define A(u,w) 	k=length(p.xy);p.x=k*(sin(mod(atan(p.y,p.x),3.14))*(sin(p.x)))/u;p.y=k-w		
#define A(u,w) 	k=length(p.xy);p.x=k*(mod(atan(p.y,p.x),2.*3.14/u)-3.14/u);p.y=k-w		
#define B(u,w) 	k=length(p.yz);p.y=k*(mod(atan(p.z,p.y),2.*3.14/u)-3.14/u);p.z=k-w		

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - .5*resolution)/resolution.y; 
	vec3 rd = normalize(vec3(uv, 1)), q = vec3(0,-180.+sin(time-5.14)*100.,-800), p; 
	gl_FragColor = vec4(0,0,uv.y,1);
	for (float i = 1.; i < 60.; i++) {
		float k;
		p=q;
		float pp=dot(p,p)/10000.;
		p.yz*=rot(1.4);
		p.xz *= rot(.2*sin(time)+sign(p.x)*-pp/8.4*(-.2+.17*(mod(time,3.14159265359*2.)<1.57? sin(time*4.):sin(time*4.)/8.))); 
		p.xy*=rot(time/3.);
	
		A(20.,0.);
		B(2.9+sqrt(abs(p.z))/24.,96.);
		float d = abs(p.x)+abs(p.y)+(p.z)-length(p)-333./length(p); 
		if (d < 0.1) {
			float s=mod(time*38.,6.28), u=.5*sin(s+length(p)/2.), u2=.5*sin(s+length(p)/12.);
			if(p.z<360.)gl_FragColor = vec4(400./i/i, 21./i,30./i,1.)-u;
			if(abs(p.z)<5.5) gl_FragColor=vec4(10./i*atan(p.z,-p.y),0,20./i-u2,1);
			break;
		}
		q += rd * d/(2.+length(p)/400.);
	}
}