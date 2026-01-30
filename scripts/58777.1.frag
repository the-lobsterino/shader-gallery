#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );

	//pos.x += 300.0;
	//pos.y += resolution.y/2.0;

	float rc = 0.5;
	float gc = 0.0;
	float bc = 0.4;
	
	vec2 p = vec2(0.5, 0.5+sin(time)*0.1);
	
	/*p.x += sin(time*0.)/40.;
	p.y += cos(time*0.)/40.;*/
	
	float d = sqrt(pow(p.x - pos.x, 2.) + pow(p.y - pos.y, 2.));
	
	float c = 0.0;
	c+=sin(d*10.);
	c-=sin(20.*pos.x + (time*1.))*sin(30.*pos.y + (time*1.));
	c += cos(0.01/d*150.);
	
	c-= d*2.;
	
	//c *= 4.*sin(time*2.);
	c*=3.;
	
	rc =c - (d*5.);
	gc =c*0.4;
	bc =c*0.1;
	
	//bc *= sin(time)*2.;
	
	//rc -= d*2.;
	
	gl_FragColor = vec4( rc-bc, gc+bc, bc+gc, 1.0);

}