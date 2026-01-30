  #ifdef GL_ES																							
 precision mediump float;                                                                               
 #endif                                                                                                 
 //by san                                                                                                       
uniform vec2 resolution;
float topRed;
float topGreen;
float topBlue;
float topAlpha;
float bottomRed;
float bottomGreen;
float bottomBlue;
float bottomAlpha;
 
 
 void main( void ) {      

	vec2 screenSize = resolution;
	 
	vec2 position = (gl_FragCoord.xy / resolution.xy);

	vec4 top = vec4(topRed/255.0, topGreen/255.0, topBlue/255.0, topAlpha/255.0);
	vec4 bottom = vec4(bottomRed/255.0, bottomGreen/255.0, bottomBlue/255.0, bottomAlpha/255.0);
	gl_FragColor = vec4(mix(bottom, top, position.y));
 }