precision mediump float;
uniform float time;
uniform vec2 mouse,resolution;
#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))
const float TAU=atan(1.)*8.;
#define A(u,v) {k=length(p.xy); p.x=k*(abs(sin(atan(p.y,p.x)))-u)-1.; p.y=k-v; }

#define M(a) (floor(a)==1.)
#define B(a) (0.<=(a)&&(a)<=1.)
vec4 getBackground(vec2 p) {
	p=p/4.+.27;
	float c= B(p.x)&&B(p.y)?1.:0.;
	for (int i=0; i<6; i++){
		p*=3.; c*=M(p.x)&&M(p.y)?0.:1.;p=fract(p);
	}
	return vec4(c*vec3(.1, .66,.44),1.);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y; 
	vec3 rd = normalize(vec3(uv, 1)), p0=vec3(0,0,-40), p;	
	gl_FragColor = getBackground(uv);	
	float k, d, d2;
	for (float i = 1.; i < 40.; i++) {
		p=p0;
		p.xy *= rot(TAU/4.);
		p.yz *= rot(time);
		for (int i=0; i<2; i++) A(.5,10.);
		d = dot(abs(p), normalize(vec3(7,-1,6)))-.4; 
		if (d < .1) {
			gl_FragColor = getBackground(p0.xy*vec2(i/8.,1.)/30.);
			gl_FragColor += vec4(1.-8.2/i); 
		}
		if (d < .001) break;	
		p0 += rd * d;
	}
}