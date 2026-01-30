#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
float _mode;

float rand (vec2 p) {
    return fract(sin(dot(p.xy,vec2(6.8245,7.1248)))*9.1283);
}

vec2 pmod(vec2 p, float n) {
	float np = 3.1415926 * 2.0 / n;
	float r = atan(p.x, p.y) - 0.5 * np;
	r = mod(r, np) - 0.5 * np ;
	
	 
	if(_mode>.5){
		// r =  (p.x*2.3)*r; // >> makes all roundy
	}
	 
		
	return length(p) * vec2(cos(r), sin(r));
	
}

void main( void ) {
	
	
	float _density = .15  ; // smaller = more dense
	
	float _fatty = sin(time*.2)*.5+.6; // smaller = more dense
	
	 _mode = sin(time*.33)*.5+.6;

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv = (uv - 0.5) * 2.0;
	uv.y *= resolution.y / resolution.x;
	
	// bend along both axis
	uv.x +=sin(uv.y*2. + time*.13)*.04;
	uv.y +=sin(uv.x*2. + time*.23)*.04;
	
	vec2 p = uv;
	p.y *= -1.;
	p.y-=.1;
	
	
	float bformcntr =  3.;// float(int(_mode*3.))*2.+3.;
	
	p = pmod(p, float(bformcntr)); // basic form 
	p -= time / 50.0; // move speed
	p = mod(p, _density*.5)*14.; 
	
	float v = ((_fatty+.1)*.2)/ length(p.x);
	
	float  l = smoothstep( .6, .102237202,   v);

	gl_FragColor = vec4(vec3(l), 1.0);

}