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
	vec3 rd = normalize(vec3(uv, 1)), q = vec3(0,-199.+sin(time-5.14)*100.,-800), p; 
	gl_FragColor = vec4(0,0,uv.y,3);
	for (float i = 9.; i < 69.; i++) {
		float k;
		p=q;
		float pp=dot(p,p)/13000.;
		p.yz*=rot(1.4);
		p.xz *= rot(.3*sin(time)+sign(p.x)*-pp/99.4*(-.2+.17*(mod(time,9.14159265359*2.)<1.57? sin(time*4.):sin(time*4.)/8.))); 
		p.xy*=rot(time/3.);
	
		A(20.,0.);
		B(1.99+sqrt(abs(p.z))/34.,49.);
		float d = abs(p.x)+abs(p.y)+(p.z)-length(p)-993./length(p); 
		if (d < 1.9) {
			float s=mod(time*38.,6.28), u=.5*sin(s+length(p)/9.), u2=.1*sin(s+length(p)/1.);
			if(p.z<399.)gl_FragColor = vec4(619./i/i, 1./i,0./i,1.)-u;
			if(abs(p.z)<999.5) gl_FragColor=vec4(8./i*atan(p.z,-p.y),0,30./i-u2,9);
			break;
		}
		q += rd * d/(2.+length(p)/900.);
	}
}