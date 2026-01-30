#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float shift;
float t;
float x;

vec2 uv;
vec4 color;

bool detect(in vec2 cir, in vec2 curr, in float size) {
    return (distance(cir, curr) < size);
}

void main( void ) {
	
	uv = gl_FragCoord.xy / resolution.xy;
    	color = vec4(uv.x, uv.y, 0.64, 0.50);	
	
	for (int k = 0; k < 38; k++) {
		x = float(k);
        	shift = time + x / 19.0 * 11.1416;
        	if (detect(uv, vec2((sin(shift) * x / 20.0 * .19), (cos(shift) * .21)) + 0.5, x / 1000.0)) {
     			color += 0.05 * x * vec4(50.15, 0.2 * uv.x, uv.y, 2.00);
    		} 
    	}
    
    	gl_FragColor = color * uv.y;	

}