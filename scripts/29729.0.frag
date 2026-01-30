#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	for(float i=0.0;i<0.8;i+=0.1){
	
	if(p.x>i && p.x<0.1+i*4.)
	
	   color += sin( p.y *cos( time * 2.0 ) * 2.0 ) ;
       //  -- action !
	   color /= sin( p.y +cos( time / 10.0 ) * 2.0 ) ;	
	}

	gl_FragColor = vec4( vec3( color, -2.+color , sin( -color + time / 2.0 ) * 0.75 ), 1.0 );

}