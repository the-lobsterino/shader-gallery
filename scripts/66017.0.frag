// 110720N

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 po = ( gl_FragCoord.xy / resolution.xy ); // - 2.*mouse ;
	po *= .5;
	//po /= dot(po,po);
	
	float t = 0.01*time*sin(8.*time);
	float color = 0.0;
	for (float x=0.;x<=100.;x+=10.) {		
		for (float y=0.;y<=100.;y+=10.) {
			color += (sin(po.x*x) * cos(po.y*y))*t;
		}
	}
	
	gl_FragColor = vec4( vec3( color ), 1.0 );

}
