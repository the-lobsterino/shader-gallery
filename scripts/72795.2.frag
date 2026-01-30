#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = vec2( gl_FragCoord.x-resolution.y/5.0 , gl_FragCoord.y-resolution.y/8.0);
	vec3 color = vec3(0, 0, 0);	
	float haba = 150.0 + 20.0*mouse.x + 20.0*mouse.y;
	for(int i=0; i<=10; i++){
		float x1 = pos.x-2.0*haba*float(i)+80.0;
		float y1 = pos.y;
		float hexagon1 = 2.0*abs(y1) + abs(sqrt(3.0)*x1 -y1) + abs(sqrt(3.0)*x1 +y1);
		if(hexagon1/100.0 <= 2.0*sqrt(3.0)){
		color = vec3(1, 0, 0);
		}
		for(int m=0; m<=10; m++){
			float x2 = x1;
			float y2 = pos.y-2.0/sqrt(3.0)*haba*float(m);
			float hexagon2 = 2.0*abs(y2) + abs(sqrt(3.0)*x2 -y2) + abs(sqrt(3.0)*x2 +y2);
			if(hexagon2/100.0 <= 2.0*sqrt(3.0)){
			color = vec3(sin(x2*float(i)*haba/10.0), 0, cos(x2*float(i)*haba/10.0));
			}
			float x3 = x1-float(i)-haba;
			float y3 = pos.y-2.0/sqrt(3.0)*haba*float(m)+0.588*haba;
			float hexagon3 = 2.0*abs(y3) + abs(sqrt(3.0)*x3 -y3) + abs(sqrt(3.0)*x3 +y3);
			if(hexagon3/100.0 <= 2.0*sqrt(3.0)){
			color = vec3(1, cos(x2*float(i+1)*haba/80.0), 0);
			}
		}
	}
	gl_FragColor = vec4( color, 1.0 );

}