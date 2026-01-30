#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

mat2 rot (float angle){
return mat2(sin(angle),-cos(angle),cos(angle),sin(angle));
}
void main( void ) {

	vec2 p = surfacePosition;
	float t,g,w,line,color = 0.0;
	t = time;
	if ((p.y>-0.30) && (p.y<0.3)) line =.020;
	
	p*=rot(-time);
	if ((p.y>-0.40)&&(p.y<0.40)&&(p.x>-0.4&&p.x<0.4))
		w = sign((mod(p.x,0.2)-0.1) *
			 (mod(p.y,0.2)-0.2));
	
	for (float i=0.0; i<.51; i+=0.01){
		t-= i*52.95;
	//	g+= step(length(p-vec2(0.3*sin(t),
	//	         0.335+0.05*abs(sin(t*7.0)))),0.0021+i*0.1);

		g+=0.0012/(length(p-vec2(0.43*sin(t+.5*cos(0.8*sin(t))),
		        0.33*(sin(t*0.10)))));
		
	}
	
	
	gl_FragColor = vec4( vec3((g*sin(time)),g+ line+color,g+w), 1.0 );
}


















