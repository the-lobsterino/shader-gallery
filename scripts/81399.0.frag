#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

        vec2 p =  (-resolution.xy+2.0*gl_FragCoord.xy)/resolution.y;
 	vec2 q = vec2( atan(p.x,p.y), 1.*length(dot(-.2*sin(p),p)/6.0) );
	float f = smoothstep(  -0.2, -0.5, sin(q.x+q.y*-30.0 - time*5.0) );
        float g = smoothstep(  01.0, -0.5, cos(q.y+q.x*0.0 + time*20.0)*q.y );
	vec3 col = mix( vec3(0.,-4.,g), vec3(2.1,0.0,4.0), f );
	 
	gl_FragColor = vec4( col, 1.5 );
 

}