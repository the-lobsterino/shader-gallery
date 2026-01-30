#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float scale = 6.00;

vec2 center = vec2(0.0, 0.0);

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	//center = mouse;
	scale = 0.2;
	center.x = 0.275337647746737993588667124824627881566714069895426285916274363067437510130230301309671975356653639860582884204637;
	center.y = 0.006759649405327850670181700456194929502189750234614304846357269137106731032582471677573582008294494705826194131450;
	
    	vec2 z, c;
    	c.x = 1.33633 * (position.x - 0.5) * scale - center.x;
    	c.y = (position.y - 0.5) * scale - center.y;
	
 	z = c;
	float iter;
    	for(int i = 0; i < 100; i++) {
        	float x = (z.x * z.x - z.y * z.y) + c.x + 0.55;
        	float y = (z.y * z.x + z.x * z.y) + c.y + 0.5567;
		
		iter = float(i);
		
        	if((x * x + y * y) > 2.0) break;
		z.x = x;
        	z.y = y;
    	}


    	gl_FragColor = vec4(vec3(0.0, iter / 40., iter / 40.) * 0.4, 1.0);
}