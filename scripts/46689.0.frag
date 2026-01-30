#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main( void ) {
	
	float d = 50.0*3.0;
	float measured[25];

	//vec2 pos = (gl_FragCoord.xy - resolution * 0.5)/resolution.y + mouse - 0.5;
	vec2 pos = vec2(gl_FragCoord.x - 100.0, gl_FragCoord.y - 500.0);
	
	float x = pos.x;
	float y = pos.y;
	
	//float d = sqrt(pos.x*pos.x + pos.y*pos.y);
	gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
	
	
	for(int i=0; i<5; i++){
		for(int j=0; j<5; j++){
			
			float X = float(i) * d;
			float Y = float(j) * d;
			
			if( (x-X)*(x-X) + (y-Y)*(y-Y) < 10.0){
				gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
				break;
			}
			
			
			
		}
	}

}