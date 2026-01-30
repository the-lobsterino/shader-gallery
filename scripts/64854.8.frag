#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  resolution;
uniform float time;

const int num_x = 11;
const int num_y = 1;
float w = resolution.x;
float h = resolution.y;

void main() {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float t = time;
	float color = 0.0;
	vec3 color2 = vec3(0.0);
	for (int i = 0; i < num_x+1; ++i) {
		for (int j = 0; j < num_y; ++j) {
			float x,y,size;
			if( float(i) < float(num_x)/2.0) x = w/float(num_x)*(float(i) + sin(t*3.0)/2.5);
			else x = w/float(num_x)*(float(i) - sin(t*3.0)/2.5);
			y = h/2.0+100.0;
			size = 3.0 - float(abs(w/2.0-x))/15.0 * sin(t*1.5);
			vec2 pos = vec2(x, y);
			float dist = length(gl_FragCoord.xy - pos);
	  	        float r = pow(size/dist, 2.0) * 1.0;
		        float g = pow(size/dist, 2.0) * 0.833 ;
		        float b = pow(size/dist, 2.0) * 0.224 ;
    			color2 += vec3(r, g, b);
		}
	}
	
	float x = w/2.0;
	float y = h/2.0+50.0;
			
	float size = 30.0;
	vec2 pos = vec2(x, y);
	float dist = length(gl_FragCoord.xy - pos);
						
	float r,g,b;
	r = g = b = pow(size/dist, 2.0) * 1.;
    	color2 += vec3(r, g, b);
	
	gl_FragColor = vec4(color2, 1.0);
}