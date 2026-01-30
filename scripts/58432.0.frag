//https://www.shadertoy.com/view/XsVSzW

// fx added !  gigatron
// better total eclipse :)

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main( void )
{
 	
	
	vec2 uv = (gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y)*4.0; 

	 

	vec2 uv0=uv;
	float i0=2.8;
	float i1=2.95;
	float i2=2.5;
	vec2 i4=vec2(0.0,0.0);
	
	for(int s=0;s<10;s++)  // iterations
	{
		vec2 r;
		r =  vec2(cos(uv.y*i0-i4.y+time/i1),sin(uv.x*i0+i4.x+time/i1))/i2;
		//r += vec2(r.y,r.x)*2.0;
		uv.xy += r*0.20 ;
        
		i0*=1.85;
		i1*=1.05;
		i2*=1.4;
		//i4+=r.xy*1.0+0.5*time*i1-sin(0.05*time);
	}
	float r=sin(uv.x-time)*0.5+0.5;
	float b=sin(uv.y+time)*0.5+0.5;
	float g=sin((sqrt(uv.x*uv.x+uv.y*uv.y)+time))*0.5+0.5;
	
	float rr = 3.4  ;
	
	
	
	vec3 c=vec3(r,g,b);
	     c  -= smoothstep( rr, rr+0.15, length( uv) );
	
	     c  *= smoothstep( rr, rr+0.005, length( uv0) );
	
	
	gl_FragColor = vec4(1,3,4,1.0);
}