#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define TWO_PI 6.2831833
#define PI 3.14159265

float circ(vec2 p)
{
    float r = length(p);
    r = log(sqrt(r));
	 
	
    return  abs(mod(r*4., TWO_PI) - PI) * 3. + .2;
}


void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	float t = TWO_PI * time / 5.0 * 0.05; 
	
	vec2 p = uv - 0.5;
	
	p.x *=  resolution.x / resolution.y;
	p *= 4.0; 
	
	float loopWiggle = 0.1; 
	
	float warp = loopWiggle / 3.; 
	
	p.x += warp * cos(0.5*t  + 30. * p.y);
	p.y += warp * sin(0.5*t + 30. * p.x); 
	
	p /= exp(mod(t * 10., PI));
	
	float v = circ(p);
	
	float disparity =.4; 
	
	disparity =  disparity * pow(abs(0.1 - v),.9);
	
	vec3 loopColor = vec3(0.2, 0.1, 0.4);
		
	vec3 col = loopColor / disparity;
	
	col =pow( abs(col), vec3(.99));
	
	float alpha = smoothstep(0.0, 0.1, min(min(col.r, col.g), col.b));
	
	gl_FragColor = vec4(col, alpha);
}