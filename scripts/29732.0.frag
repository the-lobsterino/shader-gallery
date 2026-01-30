#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// gigatron for glsl new users ... 2
// dont forget if you have black screen GPU is filling all pixels with black colors !so GPU is working always if no error !

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) ;

	float color = 0.0;
	// let's draw 2 lines vert and hor
	
	if(p.x>mouse.x && p.x <0.01+mouse.x) color +=1.0; // compare p.x to mouse.x and draw mouse.x+0.1 
	gl_FragColor = vec4( vec3( color,color,color), 1.0 );    // set vert color to white RGB to 1.0
	
	
	if(p.y>mouse.y && p.y <0.02+mouse.y) color +=0.4;  // horizontal compare p.y same as x axis 
	//                                             I
	//                                             ---------------------------
	//                                                                       V
	gl_FragColor += vec4( vec3( 2.*color,.0,.0), 1.0 ); // red component set to 0.4 
                              //  2.* Red    G  B
}