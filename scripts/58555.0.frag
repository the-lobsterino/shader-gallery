// gigatron
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float bayer( vec2 rc )
{
	float sum = 0.0;
	for( int i=0; i<3; ++i )
	{
		vec2 bsize;
		if ( i == 0 ) { bsize = vec2(2.0); } else if ( i==1 ) { bsize = vec2(4.0); } else if ( i==2 ) { bsize = vec2(8.0); };
		vec2 t = mod(rc, bsize) / bsize;
		int idx = int(dot(floor(t*2.0), vec2(2.0,1.0)));
		float b = 0.0;
		if ( idx == 0 ) { b = 0.0; } else if ( idx==1 ) { b = 2.0; } else if ( idx==2 ) { b = 3.0; } else { b = 1.0; }
		if ( i == 0 ) { sum += b * 16.; } else if ( i==1 ) { sum += b * 4.; } else if ( i==2 ) { sum += b * 1.; };
	}
	return sum / 64.;
}


void main( void ) {

	vec2 p = ( gl_FragCoord.xy-0.5* resolution.xy ) /resolution.y;
	
	//p = floor(128.*p)/128.;
	
	float tt = time;

	vec3 cl = vec3(0,0,0);
	
	float xx = sin(tt)*0.5;
	float yy = cos(tt)*0.3;
	
	float r = 0.3 ;
		 
	float by= bayer(gl_FragCoord.xy*clamp(sin(time*30.),0.8,0.98));
	
	for (float ii=0.5;ii<18.;ii++){
	
	float rr = 1.-smoothstep(r,r+0.005,length(p-vec2(-.5+xx,yy*0.9)));
		
	float gg = 1.-smoothstep(r,r+0.005,length(p-vec2(0.0-xx,yy*0.5)));	
		
	float bb = 1.-smoothstep(r,r+0.005,length(p-vec2(0.0+xx,yy*.4)));	
		
		r =r+ii/300.;
	
	  cl += vec3(rr/ii,gg/ii ,bb/ii )/ii*4.0;
	 
	}
	
	
	
	
	gl_FragColor = vec4( cl, 1.0 )*by;

}