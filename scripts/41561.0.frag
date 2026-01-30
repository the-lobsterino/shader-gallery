#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {


	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) ;

	float x = pos.x ;
	float y = pos.y;
	
	float color = 0.;
	
	color += mod((64.0  * time) / 100.0,sqrt(x*2.0 + y* y)) ;
	
	
  	vec3 f = vec3(color,color *0.5,color);
	

	gl_FragColor = vec4(f,1.0);

}