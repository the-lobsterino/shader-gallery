#ifdef GL_ES
precision mediump float;
#endif

//by TommyX 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

vec2 center = vec2(0.5,0.5);
#define ITER 100

void main( void ) {
	float scale = 2.1 + sin(time*0.5)*2.0;
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5 + (mouse-0.5) / scale;
	
	vec3 color = vec3(0.0);

	vec2 z, c;
	
	c.x = 1.3333 * (position.x) * scale - center.x;
	c.y = (position.y) * scale - center.y;
	
	z = c;
	
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
	float decay = 0.75;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.98).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.96).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.94).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.93).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.92).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.91).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.90).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.89).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.88).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.87).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.86).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.85).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.84).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.83).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.82).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.81).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.80).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.79).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.78).rgb*decay*decayx;
	color += texture2D(backBuffer, 0.5 + (bbpos-0.5)*0.77).rgb*decay*decayx;
	color *= 0.05;
	color.r *= 0.89;
	color.g *= 0.93;
	
	color += (j == ITER ? 0.0 : float(j)) / (1.0*float(ITER));
	
	gl_FragColor = vec4(color,1.0);
}