#ifdef GL_ES
precision mediump float;
#endif
//koreus7

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define HALF_PI 1.5707963267948966
#define PI 3.14159265359


float elasticOut(float t) {
  return sin(-13.0 * (t + 1.0) * HALF_PI) * pow(2.0, -10.0 * t) + 1.0;
}


float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}


vec2 polar(vec2 p)
{
	return vec2(length(p), atan(p.y/p.x));
}

vec3 myEffect(vec2 position)
{
	vec2 p = position - 0.5;
	
	float vart = elasticOut(mod(time*100.0,100.0)/100.0);
		
	
	p = polar(p);
	
	float theta = mod(PI*2.0, p.y + p.x);
	
	
	float amount = 1.0;//abs(sin(time));
	
	float r = sin(theta - 0.3)*sin(theta - 0.6) *amount*(1.0/cos(theta));

	float d = length(p)*0.29;
	
	r = pow(d,r);
	
	vec3 c = vec3(r/0.5,r,0.5);
	
	return c;
	
}


	


void main( void ) {
	

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	vec3 col = myEffect(p)*0.59;
	
	float avg = (col.r + col.g + col.b)/3.0;
	float brightness = min(avg, 0.09) + avg*avg;
	
	
	gl_FragColor = vec4(col + brightness,1.0);

}