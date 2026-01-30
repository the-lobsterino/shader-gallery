precision highp float;
uniform vec2 mouse,resolution;
#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))
#define D(u,v,w) k=length(p.xy);p.x=k*abs(sin(2.*atan(p.y,max(0.,p.x+v)))-u);p.y=k-w	
#define E(u,v,w) k=length(u);u.x=k*(mod(atan(u.y,u.x),4.3/v)-3./v);u.y=k-w	
#define F(u,w) k=length(u); u.x=k*mod(u.x/u.y,1.)-.1; u.y=k-w

void main( void ) {
	vec3 rd=normalize(vec3((gl_FragCoord.xy-.5*resolution)/resolution.y,1)), p0=vec3(0,-5,-66.+44.*mouse.y),p;
	gl_FragColor = vec4(0,0,.2,1);	
	for (float i = 1.; i < 60.; i++) {
		p=p0;
		float k;
		p.xy*=rot(1.57);
		p.yz *= rot(mouse.x*6.);
		p.xy*=rot(.78);
		p.xz*=rot(sign(p.z)*1.57/2.);
		if(distance(p,vec3(-9,5,8.*sign(p.z)))<4.) p.x=length(p.xy); 
		else for (int i = 0; i < 2; i++) {
			D(.75,12.,7.);		
			p.xz=-abs(p.xz);// symmetrical
			E(p.xz,5.,2.2);	
			E(p.xy,24.,4.2);
			F(p.xy,.50);
		}
		float d = dot(abs(p), normalize(vec3(-4.,3.,2.6))) - 1.; 
		if (d < .1) gl_FragColor.rgb = vec3(normalize(p)*16./i);
		if (d < .001) break;	
		p0 += rd * d/2.;	
	}
}