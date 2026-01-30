#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

    vec2 x,z;
	float i = gl_FragCoord.x;
	float j = gl_FragCoord.y;
	float gray = 0.0;
	float delta = 2.4/resolution.x;
    float countf ;
	
	x = vec2(-1.2 + (i * delta), -1.2 + (j * delta));
	z = vec2(-0.74543, 0.11301);
		
	
	for (int count = 0; count < 128; count++) {
    		x = vec2(x.x*x.x - x.y*x.y, 2.0 * x.x * x.y)+ z;
		if (length(x) > 2.0) break;
		
		countf= float(count);
	}

	
	if (length(x) <= 2.0){
		gray = 0.0;
	}else{
		gray = countf/128.0;
	}
	
	gl_FragColor = vec4(vec3(gray), 1.0 );

}
