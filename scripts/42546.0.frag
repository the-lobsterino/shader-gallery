#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// thx for smoothabs ,
float smoothabs(float t)
{
	return t < 0.0 ? t * -1.0 : t;	
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
 
	

	vec3 c = vec3(0.0, 0.0, 0.0);
	
	float aa = fract(mod(time/10.,1.0));
	float bb = fract(mod(time/5.0,1.0));
	float cc = fract(mod(time/8.2,1.0));
	 
	
	float g = smoothabs(2.0*smoothstep(0.0, 0.1, mod(p.y - time * 0.05, 0.1))-1.0); 
 
	
	c = vec3(g);
	 
	

	gl_FragColor = vec4( vec3( c.r*aa,c.g*bb,c.b*cc ), 1.0 );

}