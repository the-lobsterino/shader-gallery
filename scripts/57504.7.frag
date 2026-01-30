#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);

	vec2 sq=vec2(0,0);
	vec3 col=vec3(0);
	float c=0.;
	float ma=0.;
	for(int i=1;i<10;i++){
		vec2 pp=floor(p*(pow(0.1,fract(time/4.)+1.))*pow(3.,float(i))+vec2(0.5,0.5));
		float cc=(1.-max(abs(pp.x),abs(pp.y)));
		if(mod(float(i),2.)==0.)
			cc=abs(cc-1.);
		if(cc==c)break;
		c=cc;
		
		
				
	}
	col=vec3(c,c,1);
	
	

	gl_FragColor = vec4( col, 1.0 );

}