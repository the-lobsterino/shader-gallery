#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define time time*2.0

float cercle(vec2 uv, vec2 centre , float r) {
    
    
    //uv.x *= resolution.x/resolution.y;
    
    return 1.0-smoothstep(r-0.001,r+0.001,distance(uv,centre));
    
}    



void main( void ) {

	vec2 p = 1.2*( gl_FragCoord.xy -0.5* resolution.xy )/min(resolution.x,resolution.y) ;
	
	vec2 c1 = vec2(.0 + cos(time*0.7)*0.35, 0. + sin(time*0.7)*0.35);
	vec2 c2 = vec2(.0 - cos(time*0.7)*0.35, 0. - sin(time*0.7)*0.35);

	float color = 0.0;
		color += cercle(p,c1,0.3 + 0.1*cos(time*0.2));
	
		color += cercle(p,c2,0.2);
		color -= cercle(p,vec2(c1.x + 0.15*sin(time*5.0), c1.y+0.15*cos(time*4.9)),0.05);
		color -= cercle(p,vec2(c1.x + 0.15*sin(time*5.1+3.14159), c1.y+0.15*cos(time*5.0+3.14159)),0.05);
		color -= cercle(p,vec2(c2.x + 0.15*sin(time), c2.y-0.15*cos(time)),0.05);
	
	 
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}