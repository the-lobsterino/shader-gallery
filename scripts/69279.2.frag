#ifdef GL_ES
precision mediump float;
#endif



#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//#define K3

float nyu = 1.0;

vec2 kakeru(vec2 a, vec2 b){
	return vec2(a.x*b.x-a.y*b.y,a.x*b.y+b.x*a.y);

}
	
vec2 wari(vec2 a, vec2 b){
	return vec2(a.x*b.x+a.y*b.y,b.x*a.y-b.y*a.x)/(b.x*b.x+b.y*b.y);
}


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	

	p = (p - 0.5)*12.0;

	p.x *= resolution.x/resolution.y;
	
	
	vec2 kai = vec2(0.,1./2.*nyu*sin(p.x));
	
	vec2 rutonaka = kakeru(kai,kai)-2.0*kai+vec2(1.0,0.0);
	
	
	#ifdef K3
		 kai = vec2(0.,1./3.*nyu*sin(p.x));
		
		rutonaka = -3.0*kakeru(kai,kai)-6.0*kai+vec2(1.0,0.0);
	#endif
	
	vec2 rutokekka = vec2(0.0);
	
	
	if(rutonaka.y>0.0){
		
		rutokekka.x += pow((rutonaka.x+length(rutonaka))/2.,0.5);
		rutokekka.y += pow((-rutonaka.x+length(rutonaka))/2.,0.5);
	}else{
	
		rutokekka.x += pow((rutonaka.x+length(rutonaka))/2.,0.5);
		rutokekka.y -= pow((-rutonaka.x+length(rutonaka))/2.,0.5);
	
	}
	
	vec2 ans = wari(vec2(vec2(1.0,0.0)- kai + rutokekka),vec2(2.0*(vec2(1.,0.0)+kai)));
	
	vec2 ans2 = wari(vec2(vec2(1.0,0.0) - vec2(0.0,0.5*nyu*sin(p.x))),vec2(vec2(1.0,0.0) + vec2(0.0,0.5*nyu*sin(p.x))));
	
	float c1  = 0.01/abs(ans.x -p.y);
	
	float c2 =  0.01/abs(ans.y -p.y);
	
	float y0 =  0.01/abs(-p.y);
	
	float y3 =  0.01/abs(1.0-p.y);
	
	float c3 = 0.01/abs(length(ans)-p.y);
		

	gl_FragColor = vec4( c3+ vec3(c1,c2,y3+y0), 1.0 );

}