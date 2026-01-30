//fail attempt to create a 7x7 grid of circles
//

precision mediump float;

uniform float time;
uniform vec2 resolution;

#define MAX_ITER 49

void main(void){
	vec3 color = vec3(0.0);
	for (int n = 0; n < MAX_ITER; n++)  {
	  //the size of the circle
	  float size = sin(1.- time)*(10.0 / float(MAX_ITER));
	  //the actual color of the circle
	  vec3 circle_color = vec3(1.0,0.0,0.0);
		
	  float p = 0.0;
	  if(n!=0){
 	    p = sqrt(float(MAX_ITER))/float(n);
	  }
		
	  color += 1. / ( 50.0 * pow(float(MAX_ITER),1.6) * abs((3.0 * length(vec2(p*0.5,0.5)+(gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y)) - size))) * circle_color;
	}
	
	gl_FragColor = vec4(color, 1.);
}