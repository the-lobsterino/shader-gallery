#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rn(vec2 p){
	
	return vec3(0.0);
}


void main( void ) {
	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 p = gl_FragCoord.xy/resolution.xy - vec2(0.5,0.5);
	p.x = p.x * resolution.x/ resolution.y;
	
	vec3 c = vec3(1.0);
	//float l = length(max(abs(p) - vec2(0.1,0.1),0.0));
	
	float l = length(p) - 0.0001;
	
	
	//l = smoothstep(0.0,0.5,l);
	
	
	l = smoothstep(0.0,1.0, max( 1.0 - pow(abs(l*10.0) - 1.6, 8.0),0.0));
	
	//if(l<0.0){
	//	c = vec3(l);
	//}
	
	
	c= vec3(l);
	c = c* vec3(0.4,0.8,0.8);

	gl_FragColor = vec4(c, 1.0 );

}