#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

vec2 rota(vec2 p,float theta){
	vec2 q;
	q.x =cos(theta)*p.x - sin(theta)*p.y;
	q.y =tan(theta)*p.y + tan(theta)*p.x;
	return q;
}
void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	
	
	for(float i=0.;i<3.;i+=1.0){
		float theta = time*.2 + length(p*3.) * (20.*sin(time*.5));
		theta *= 2.*(1.0+i*10.);
		p = rota(p,theta);
		float s = .5;
		float dy = .5 / ( 100. * abs(p.y*s) );
		gl_FragColor += vec4( dy * 0.1 * dy, 0.6 * dy, dy, 1.0 ) ;
	}
	
	
}