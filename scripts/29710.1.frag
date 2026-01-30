#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Rolling shutter effect on a propeller
//Move the mouse left/right to increase/decrease the shutter time

#define NUM_BLADES 3.0
#define BLADE_WIDTH 0.02
#define BLADE_LENGTH 0.40
#define HUB_SIZE 0.08

#define PROP_SPEED 0.2
#define MAX_SHUTTER_TIME 20.0

float pi = atan(1.0)*8.0;

mat2 Rotate2D(float angle)
{
	return mat2(cos(angle),sin(angle),-sin(angle),cos(angle));	
}

void main( void ) 
{
	vec2 res = resolution / resolution.y;
	vec2 uv = gl_FragCoord.xy / resolution.y - res / 2.0;
	
	float shutterTime = uv.y * mouse.x*MAX_SHUTTER_TIME;
	float angle = 2.0 * pi * (time - shutterTime) * PROP_SPEED;
	
	uv *= Rotate2D(angle);
	
	float d = 0.0;	
	
	float bladeAng = (pi/NUM_BLADES);
	
	//Blades
	d = abs(mod(atan(uv.y, uv.x) + bladeAng/2.0, bladeAng) - bladeAng/2.0) * length(uv);
	d -= BLADE_WIDTH;
	
	//Hub / Blade length
	d = min(d, length(uv) - HUB_SIZE);
	d = max(d, length(uv) - BLADE_LENGTH);
	
	float c = smoothstep(1.0/resolution.y, 0.000, d);
	
	gl_FragColor = vec4(vec3(c), 1.0);

}