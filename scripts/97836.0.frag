#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))
//#define A(u,w) 	k=length(p.sy);p.x=k*(sin(mod(atan(p.y,p.x),3.14))*(sin(p.x)))/u;p.y=k-w		
#define A(u,w) 	k=length(p.xy);p.x=k*(mod(atan(p.y,p.x),2.*3.14/u)-3.14/u);p.y=k-w		
#define B(u,w) 	k=length(p.yz);p.y=k*(mod(atan(p.z,p.y),2.*3.14/u)-3.14/u);p.z=k-w
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	vec2 uv = (gl_FragCoord.xy - .4*resolution)/resolution.y; 
	vec3 rd = normalize(vec3(uv, 1.6)), q = vec3(0,-299.+sin(time-3.14)*100.,-800), p; 
	gl_FragColor = vec4(1,1,uv.y,2.5);
	for (float i = 6.5; i < 79.5; i++)  {
		float k;
		p=q;
		float pp=dot(p,p)/3000.;
		p.yz*=rot(1.0);
		p.xz *= rot(.3*sin(time)+sign(p.x)*-pp/99.4*(-.2+.17*(mod(time,9.14159265359*2.)<1.57? sin(time*4.):sin(time*4.)/8.))); 
		p.xy*=rot(time/3.);
	
		A(20.,0.);
		B(1.99+sqrt(abs(p.z))/34.,49.);
		float d = abs(p.x)+abs(p.y)+(p.z)-length(p)-993./length(p); 
		if (d < 1.9) {
			float s=mod(time*30.,6.28), u=1.5*sin(s+length(p)/5.), u2=1.1*sin(s+length(p)/1.6);
			if(p.z<299.)gl_FragColor = vec4(619./i/i, 2./i,0./i,1.)-u;
			if(abs(p.z)<99.5) gl_FragColor=vec4(8./i*atan(p.z,-p.y),1,20./i-u2,5);
			break;
		}
		q += rd * d/(2.+length(p)/600.);
		gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	}


		//not mine
}