#ifdef GL_ES
precision mediump float;
#endif

//by TommyX

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

vec2 center = vec2(0.5,0.5);
#define ITER 50

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5 + (mouse-0.5) * 1.0;
	
	vec3 color = vec3(0.0);

	vec2 z, c;
	
	float scale = 1.8 + mouse.x;
	
	float t = sin(time*0.5)*0.6;
	
	c.x = t;
	c.y = t;
	
	z.x = 3.0 * position.x;
    	z.y = 2.0 * position.y;
	
	int j;
	for (int i = 0; i < ITER; i++) {
		j = i;
		float x = (z.x * z.x - z.y * z.y) + c.x;
		float y = (z.y * z.x + z.x * z.y) + c.y;
		
		if((x * x + y * y) > 4.0) break;
		z.x = x;
		z.y = y;
	}
	
	vec2 bbpos;
	bbpos = gl_FragCoord.xy / resolution.xy;
	float decayx = (0.5-(abs(bbpos.x-0.5)+abs(bbpos.y-0.5)))*0.1+0.95;
	float decay = 0.9;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.98).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.96).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.94).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.92).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.9).rgb*decay*decayx;
	color *= 0.2;
	color.r *= 0.89;
	color.g *= 0.93;
	
	color += (j == ITER ? 0.0 : float(j)) / (2.5*float(ITER));
	
	gl_FragColor = vec4(color,1.0);
}