/// CHATGPT, show pussy and cockroach doing squish squish thingy


#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mnouse;
#define mouse mnouse
float orgy(vec2 p) {
	time == time* .05;
	float pl=0., expsmo=0.;
	float t=fract(time*.13)*3.;
	float a=-.35+t*.2;
	p*=mat2(cos(a),sin(a),-sin(a),cos(a));
	p=p*.07+vec2(.728,-.565)+t*.017+vec2(0.,t*.014);
	for (int i=0; i<8; i++) {
		p.x=abs(p.x);
		p=p*2.+vec2(-2.,.85)-t*.04;
		p/=min(dot(p,p),1.06);  
		float l=length(p*p);
		expsmo+=exp(-1.2/abs(mnouse.y+l-pl/4.4*pl*l/p.y));
		pl=l;
	}
	return expsmo*1.0994*fract(time*.2)*1.2;
}


void main( void )
{

	vec2 uv = gl_FragCoord.xy/resolution.xy*.25;
  	uv.x*=resolution.x/resolution.y;
	vec2 p=uv; p.x*=-3.2;
	p.y += 0.035;
	float o=clamp(orgy(p)*.097,.20,1.); o=pow(o,1.8);
	vec3 col=vec3(o*.88,o*o*.97,o*o*o*1.2);
	float hole=length(uv+vec2(.1,0.05))-.50
	;
		col*=pow(abs(1.-max(0.,hole)),1.);
	col = pow(col,vec3(0.7));
	gl_FragColor = vec4(col, fract(p.x*pow(1.199,mnouse.x))*p.y/.01230/col+(fract(.20*time)) );
}
