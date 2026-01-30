#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int iterations = 300;


vec3 getCol(float p){ 
	return vec3(p*1.299,0. , p*0.114); 
}


void main() {

    float cc;
    vec2 c = vec2(sin(time*.3),0.524118);	
    vec2 uv = gl_FragCoord.xy / resolution.xy ;
	

    vec2 z;
	
    z.x = 3.0 * (uv.x - 0.5);
    z.y = 2.0 * (uv.y - 0.5);
   	
    for(int i=0; i<iterations; i++) {
       float x = (z.x * z.x - z.y * z.y) + c.x;
	float y = (z.y * z.x + z.x * z.y) + c.y;
	    if((x * x + y * y) > 4.0) {
		    cc = float(i);
		    break;
	    }
        z.x = x;
        z.y = y;
   }

   gl_FragColor =  vec4(getCol(cc),1.0) / 100.;

}