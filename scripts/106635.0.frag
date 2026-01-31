//  No python.... !
//  Amigaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!
// See U at TrSAC in DK!

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
    	color = vec4(uv.x, uv.y, 0.4, 1.0);	
	
	for (int k = 0; k < 48; k++) {
		x = float(k);
        	shift = time + x / 9.0 * 1.1416;
        	if (detect(uv, vec2((sin(shift) * x / 100.0 * .9), (cos(shift) * 0.1)) + 0.5, x / 768.0)) {
     			color += 0.1 * x * vec4(30.15, 0.6 * uv.x, uv.y, 10.00);
    		} 
    	}
    
    	gl_FragColor = color * uv.y;	

}