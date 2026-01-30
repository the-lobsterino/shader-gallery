#extension GL_OES_standard_derivatives : enable

#define ANTIALIASING_X_STEPS 4.0   // 4 is more than enough to see smooth picture
#define ANTIALIASING_Y_STEPS 32.0

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 cellTexture(vec2 uv)
{
	vec3 color = vec3(0.0);
	
	if ((abs(uv.x) < 0.5 && abs(uv.y) < 0.5) || (abs(uv.x) > 0.5 && abs(uv.y) > 0.5))
	{
		color += 1.0;
	}
	
	return color;
}

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col = vec3(0.0);
	
	if (p.y < 0.0)
	{
		for(float x = 0.0; x < ANTIALIASING_X_STEPS; x++) {
			for(float y = 0.0; y < ANTIALIASING_Y_STEPS; y++)
			{
				float sc = 1.0 + sin(time * 3.0) * 0.67;
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