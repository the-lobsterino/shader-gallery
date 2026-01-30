#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float bx(vec2 p,vec2 s)
{
    vec2 b = abs(p);
    vec2 a = max(b - s,vec2(0.0));
     
    float d = length(a);
    
    return smoothstep(0.0,0.019,d);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )  ;
	
	vec2 q = p-vec2(0.5,0.5);

	float c = 0.0;
	
	for (float i=0.0;i<30.0;i++){
		
		q = q-vec2( i*0.02+0.4*cos(time)*.3,0.4*sin(time)*.2);
		 
		
		
		c += 0.95-bx(q,vec2(0.05,0.1))+i*0.003;
		
	}
	

	gl_FragColor = vec4(   c*0.3,0.95-c+sin(time)*0.5,c*c*c*c, 1.0 );

}