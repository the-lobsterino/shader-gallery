#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float scale = 4.00;
float iter;

vec2 center = vec2(0.5, 0.0);

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	//center = mouse;
	
    	vec2 z, c;
    	c.x = 1.3333 * (position.x - 0.5) * scale - center.x;
    	c.y = (position.y - 0.5) * scale - center.y;
	
 	z = c;
	
    	for(int i = 0; i < 100; i++) {
        	float x = (z.x * z.x - z.y * z.y) + c.x;
        	float y = (z.y * z.x + z.x * z.y) + c.y;
		
		iter = float(i);
		
        	if((x * x + y * y) > 4.0) break;
		z.x = x;
        	z.y = y;
    	}

    	gl_FragColor = vec4(iter * sin(time), iter / 40.0, iter / 20.0, 0.0);
}