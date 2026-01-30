#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float cercle(vec2 uv, vec2 centre , float r) {
    
    
    uv.x *= resolution.x/resolution.y;
    
    return 0.5-distance(centre, uv); //1.0-smoothstep(r-0.001,r+0.001,distance(uv,centre));
    
}    



void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float color = cercle(p,vec2(0.6,0.6),0.2);
	
 
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}