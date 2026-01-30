#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition;
	float t,g,w,line,color = 0.0;
	t = time;
	if (p.y>0.0) w = sign(mod(p.x,0.1)-0.02)*0.3*abs(p.y);
	
	for (float i=0.0; i<0.1; i+=0.01){
		t+= i*.9;
		g+= step(length(p-vec2(0.7*sin(t),
		         0.335+0.05*abs(sin(t*7.0)))),0.0021+i*0.1);
		
	}
	
	if ((p.y>0.3260) && (p.y<0.33)) line =1.0;
	
	gl_FragColor = vec4( vec3(g+w, line+color, line), 1.0 );
}


















