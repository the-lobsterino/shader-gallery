/// 看IQ的教学视频做了一遍夕阳椰树，对shader理解更深入了

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;

	vec2 q = p - vec2(0.3, 0.7);
	vec3 col = vec3(1.0, 0.6, 0.2);
	col = mix(col, vec3(1.0, 0.8, 0.3), p.y);
	//col *= length( q );
	
	float r = 0.2 + 0.1*cos( atan(q.y, q.x)*10.0 + p.x*20. + 1.);
	
	col*= smoothstep(r, r + 0.01, length( q ));

	r = 0.015;
	
	r += 0.002*cos(120.0*q.y); 
	r += exp(-40.0*p.y);
	
	col*= 1.0 - (1.0 - smoothstep(r, r + 0.002, abs(q.x - 0.25*sin(2.0*q.y))))*(smoothstep( 0.0, 0.1, -q.y));
	
	//col *= mix(col, vec3(1.0, 0.8, 0.3), p.y);
	
	gl_FragColor = vec4( col, 0.5 );

}