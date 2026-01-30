//ftfy

precision mediump float;

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define p surfacePosition

#define MAX_ITER 49

void main(void){
	vec3 color = vec3(0.0);
	vec3 circle_color = vec3(1.0,0.0,0.0);
	float size = (1.+sin(time+length(p)*4.))*(1.0 / float(MAX_ITER));
	float mu = sqrt(float(MAX_ITER));
	for (int n = 0; n < MAX_ITER; n++){
		//the size of the circle
		//the actual color of the circle
		float nu = float(n);
		float M = mod(nu, mu);
		float N = (nu - M)/mu;
		vec2 center = vec2(M,N)/mu;
		
		if(length(p*4.-center) < size){
			color = circle_color;
			break;
		}
		//color += 1. / ( 50.0 * pow(float(MAX_ITER),1.6) * abs((3.0 * length(vec2(p*0.5,0.5)+(gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y)) - size))) * circle_color;
	}
	
	gl_FragColor = vec4(color, 1.);
}