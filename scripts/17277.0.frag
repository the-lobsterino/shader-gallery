#ifdef GL_ES
precision mediump float;
#endif

//fixed uninitialized varibles for intel (yuck!) GPU's

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0, r =0.,g=0. ,b=0.;
	float x = position.x;
	float y = position.y;

	r = .2/cos((x*32.+(time/50.)*100.));
	r += .1/cos((y*32.*resolution.y/resolution.x+(time/50.)*100.));
	r -= 0.9;
	r += sin(x*30.)*1.9;

	g = .7/cos((x*32.+(time/50.)*100.));
	g += 1.2/cos((y*32.*resolution.y/resolution.x+(time/50.)*100.));
	g -= 0.2;
	g += sin(x*30.)*.3;
	
		
	gl_FragColor = vec4(r,g,0,1.0 );

}