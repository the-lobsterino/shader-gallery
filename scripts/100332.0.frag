// some sex
precision lowp float;
uniform float time;
uniform vec2 mouse, resolution;

#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))
#define A(u,w) 	k=length(p.xy);p.x=k*(mod(atan(p.y,p.x),3.14))/u;p.y=k-w		
#define B(u,w) 	k=length(p.yz);p.y=k*(mod(atan(p.z,p.y),3.14/u)-1.57/u);p.z=k-w		

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - .5*resolution)/resolution.y;
	vec3 rd = normalize(vec3(uv, 1)), q = vec3(0,0,-680), p; 
	gl_FragColor = vec4(0);
	for (float i = 1.; i < 270.; i++) {
		float k;
		p=q;
		p.xz*=rot(3.14/4.);
		p.yz*=rot(77.+(sin(time))/sqrt(length(p))*77.+time*2.); 
		p.xz *= rot(time-length(p)/500.); 
	
		A(5000.,66.);
		B(2.,16.);
		B(2.25,80.);
		float d = abs(p.x)+abs(p.y)+(p.z)-length(p)-2.; 
		if (d < 0.1) {
			gl_FragColor = vec4(60./i, 33./i-exp(1.-abs(p.z)),44./i,1.);
			break;
		}
		q += rd * d/(4.*exp(length(p)/6000.)+dot(p/1000.,p/1000.));
	}
}