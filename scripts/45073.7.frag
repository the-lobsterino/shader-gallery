/*
           co3moz
     github.com/co3moz

     draw => for y-finite solutions
     drawYInfinite => for y-infinite solutions

     press left button of mouse and move for move.
     press right button of mouse and move for scale.
     press shift and left button of mouse, move a little bit will reset to default position.
*/

precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define draw(function, r, g, b) if(distance(function(p.x - c.x), p.y - c.y) < 0.005) color = vec3(r, g, b)
#define drawYInfinite(function, r, g, b) if(distance(function(p.x - c.x), p.y - c.y) < abs(function(p.x - c.x) - function(p.x - c.x - 0.01))) color = vec3(r, g, b)
#define mouseTrack(function) if(distance(mouse.x * aspect.x, p.x) < 0.003 && function(p.x - c.x) - p.y + c.y > 0.0 && sin((c.y - p.y) * 200.0) < 0.1) color = vec3(0.5, 0.5, 0.5)

/*
   analog to digital circuits
*/


#define how_much_bits_for_data (4.0)

float noise(float);

float analog(float k) {
	float x = k+time/3.0 + 105.0;
	float y =  noise(x);
	
	for(float z = 2.0; z < 180.0; z+=2.0) {
		y+=noise(y + x * z + log(x)) / z;
	}
	
	
	float m = y * 0.5;
	
	return m;
}

float adc(float k) {
	if(k > 0.0) {
		return analog(k);	
	}
	
	float m = analog(k) * pow(2.0, how_much_bits_for_data);
	
	return (m - fract(m)) / pow(2.0, how_much_bits_for_data);
}

void main(void) {
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y);
	vec2 c = vec2(0.5) * aspect - surfacePosition * 1.5;
	vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y);
	vec3 color = vec3(0.0);
	
	draw(adc, 1.0, 1.0, 1.0);
	
	if(distance(p.y, c.y) < 0.005 && sin((c.x - p.x) * 200.0) < 0.1) color = vec3(0.0, 1.0, 0.0); // horizontal
	if(distance(p.x, c.x) < 0.005 && sin((c.y - p.y) * 200.0) < 0.1) color = vec3(1.0, 0.0, 1.0); // vertical
	gl_FragColor = vec4(color, 1.0);
}

float rand(float n){return fract(sin(n) * 43758.5453123);}

float noise(float p){
	float fl = floor(p);
  float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}