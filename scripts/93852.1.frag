#extension GL_OES_standard_derivatives : enable

#define ANTIALIASING_X_STEPS 4.0   // 4 is more than enough to see smooth picture
#define ANTIALIASING_Y_STEPS 32.0

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int   complexity      = 150;                  // More points of color.
float mouse_factor          = 3.01*sin(0.02*time);  // Makes it more/less jumpy.
const float mouse_offset    = 100.0;                // Drives complexity in the amount of curls/cuves.  Zero is a single whirlpool.
const float fluid_speed     = 2.0;                 // Drives speed, higher number will make it slower.
const float color_intensity = 0.3;

vec3 cellTexture(vec2 uv)
{
	vec3 color = vec3(0.0);
	
	vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
	for(int i=1;i<complexity;i++) {
		vec2 newp=p;
		newp.x+=0.5/float(i)*cos(float(i)*p.y+time/fluid_speed+0.9*float(i))+mouse_offset + mouse.x / 100.;
		newp.y+=0.5/float(i)*sin(float(i)*p.x+time/fluid_speed+0.5*float(i+10))-mouse_offset + mouse.y / 150.;
		p=newp;
	}
	
	vec3 col=vec3(color_intensity*sin(3.0*p.x)+color_intensity + 0.3,color_intensity*sin(3.0*p.y)+color_intensity + 0.2,0.9);
	
	
	if ((abs(uv.x) < 0.5 && abs(uv.y) < 0.5) || (abs(uv.x) > 0.5 && abs(uv.y) > 0.5))
	{
		color += col;
	}
	
	return color;
}

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col = vec3(0.0);
	
	//if (p.y < 0.0)
	{
		for(float x = 0.0; x < ANTIALIASING_X_STEPS; x++) {
			for(float y = 0.0; y < ANTIALIASING_Y_STEPS; y++)
			{
				float sc = 12.0 + sin(time * 3.0) * 0.37;
				vec2 uv = (gl_FragCoord.xy + (vec2(x, y) - 0.5) / vec2(ANTIALIASING_X_STEPS, ANTIALIASING_Y_STEPS) - resolution.xy * 0.5) / min(resolution.x, resolution.y);
				uv.x *= sc/(uv.y+0.0);
				uv.y = sc/(uv.y);
				uv.x = mod(uv.x, 2.0)-1.0;
				uv.y = mod(uv.y-4.0*time, 2.0)-1.0;
				col += cellTexture(uv);
			}
		}
		
		col /= ANTIALIASING_X_STEPS * ANTIALIASING_Y_STEPS;
	}

	gl_FragColor = vec4(col, 1.0);
}