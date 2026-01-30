#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	 vec3   col =vec3(0.,0.,0.);
	vec2 p = ( gl_FragCoord.xy*2.- resolution ) / min(resolution.x,resolution.y );
	vec2 m =  vec2(mouse.x*2.0-1.0,-mouse.y*2.0+1.0);

	float u =0.6*sin((atan(p.y,p.x)-time*0.2)*16.0);
	float t =0.0405/abs(0.15+u-length(p));
	  col +=vec3(0., t,t);  
	
	float u1 =0.6*sin((atan(p.y,p.x)+time*0.2)*16.0);
	float t1 =0.06/abs(0.25+u1-length(p));	 
	
	  col +=vec3(t1,t1/3.,0.); 
	
	 float t2 =0.06/length(p);
	// col +=vec3(t2,0.,0.);
	
	gl_FragColor = vec4( col,1.0 );

}