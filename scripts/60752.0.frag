// Flower Matrix
// By: Brandon Fogerty
// xdpixel.com
// Forked guud
// ass


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x/resolution.y;
	
	vec2 px = gl_FragCoord.xy;
	px.x+=sin(time+px.y*0.01)*0.07;
	///px *= 4.;
	
	
	vec3 finalColor = vec3( 0.1, 0.2, 0.3 );

	float a = 0.;//atan( uv.y / uv.x );
	float r = -1.5 + length( uv );
	

	float timeT = .1;//sin(time) * 0.5 + 0.5;
	float move = .6 + time;
	
     	float t = .7 + .1 * sin(move * 1.);
    
     	finalColor += vec3( 8.0 * t, 4.0 * t, 2.0 * t );
    
     	finalColor *= .5 * (1.-r);
	
	float g = -mod( px.y + time, cos( px.x ) + 0.004 ) * .5;
	finalColor *= vec3( (g/2.)*(resolution.y-gl_FragCoord.y)/resolution.y, g/2., g );
	
	gl_FragColor = vec4( finalColor, 1.0 );

}