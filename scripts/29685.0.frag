#ifdef GL_ES
precision mediump float;
#endif

// Inspired by by Pablo Román Andrioli (Kali)


uniform float time;
uniform vec2 resolution;

float orgy(vec2 p) {
	float pl=0., expsmo=0.;
	float t=sin(time*7.);
	float a=-.35+t*.02;
	p*=mat2(cos(a/5.0),sin(a),-sin(a),cos(a));
	p=p*.1+vec2(.726,-.557)+t*.017+vec2(0.,t*.014);
	for (int i=0; i<100; i++) {
		p.x=abs(p.x);
		p=p*2.+vec2(-2.,.84)-t*.04;
		p/=min(dot(p,p),1.06);  
		float l=length(p*p);
		expsmo+=exp(-1.0/abs(l-pl*1.0));
		pl=l;
	}
	return expsmo;
}


void main( void )
{
	vec2 uv = gl_FragCoord.xy/resolution.xy-.5;
  	uv.x*=resolution.x/resolution.y;
	vec2 p=uv; p.x*=1.2;
	float o=clamp(orgy(p/1.5)*.07,.2,1.); 
	o=pow(o,1.8);
	vec3 col=vec3(o*.85,o*o*.87,o*o*o*.8);
	gl_FragColor = vec4(col*1.6+.25, 1.0 );
}
