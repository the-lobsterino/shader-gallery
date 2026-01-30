#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution.xy;
	vec2 q = p - vec2(0.33,0.7);
		
	vec3 col =  vec3(0.4,0.7,0.0) ;
	
	float f = 0.2 + 0.1*cos( atan(q.y,q.x)*10.0 + 20.0*q.x + 1.0+0.2+sin(time));
	

	
	col *= mix( vec3(0), vec3(0.0,0.5-smoothstep( f, f+0.02, length( q ) ),0.0), 1.0 );
	
	float r = 0.015;
	r += 0.002*sin(120.0*q.y+sin(time));
	r += exp(-40.0*p.y);
 	
	col += mix(vec3(0.90 - (1.0-smoothstep(r,r+0.002, abs(q.x-0.25*sin(2.0*q.y)+q.x*sin(time)*0.01)))*(1.0-smoothstep(-0.3,-0.1,q.y))*0.9,0.0,0.0),
			
			vec3(r*0.98,r*0.92,0.1),0.8);
	
	gl_FragColor = vec4(col,1.0);

}