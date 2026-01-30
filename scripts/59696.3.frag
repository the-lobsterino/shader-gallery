#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {
	
	vec2 st = 0.75*(gl_FragCoord.xy-0.5*resolution.xy)/resolution.y;
	vec2 u = 0.75*(gl_FragCoord.xy-0.5*resolution.xy)/resolution.y;
  	st.y+=.06725;

  	vec4 col1 = 0.5*(1.0 + cos(time +st.xyxy+vec4(0,1,2,0)));
  	vec4 col2 = 0.25*(1.0 + cos(time/3. +st.xyxy+vec4(0,2,4,0)));
  	vec4 col3 = 0.5*(1.0 + cos(time/5. +st.xyxy+vec4(0,3,6,0)));
	vec4 col4 = 0.25*(1.0 + cos(time/7. +st.xyxy+vec4(0,4,8,0)));
 
  	float a = atan(st.x,st.y)+3.14;
	float b = atan(u.x,u.y)+3.14;
  
  	float r1 = 6.28/3.; 
  	float d1 = cos(floor(0.5+a/r1)*r1-a)*length(st*8.);
  	vec4 shape1 = vec4(1.0-smoothstep(0.75,1.0,d1))+vec4(d1);
  
  	float r2 = 6.28/4.; 
  	float d2 = cos(floor((time/20.)+a/r2)*r2-a)*length(st*8.0);
	vec4 shape2 = vec4(1.0-smoothstep(0.75,1.0,d2))+vec4(d2);
	
	float d4 = cos(floor(0.5+0.05*sin(time)+a/r2)*r2-a)*length(st*6.0);
	vec4 shape4 = vec4(1.0-smoothstep(0.75,1.0,d4))+vec4(d4);
	
	float r3 = 0.1;
	float d3 = cos(floor(0.5+a/r3)*r3-a)*length(st*8.);
	vec4 shape3 = vec4(1.0-smoothstep(0.75,1.0,d3))+vec4(d3);
 
 	vec4 co=vec4(0.0);
 	co+=vec4(1.-shape2 + col3)*-0.01;
 	co/=vec4(1.-shape1 + col2 );
 	co/=vec4(1.-shape3 + col1 );
	co+=vec4(1.-shape4 +col4 );
 
 	gl_FragColor =co;

}