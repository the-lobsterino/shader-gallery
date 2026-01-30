#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//pull me out of your crash
void main( void ) 
{
	float x = 128.;
	float y = 64.;
	float p = x * y;
	

	vec2 uv = gl_FragCoord.xy/resolution.xy;
	uv = floor(uv * vec2(x, y));
	
	//index
	float i = uv.y * x + mod(uv.y * x + uv.x, x);
	
	
	//index pos
	float j = float(i == floor(mouse.x*p));
	
	//mouse pos
	vec2 m = floor(mouse*vec2(x,y));
	
	//xy pos
	float k = float(m == uv);
	
	
	float l = float(i/x > mod(i+floor(time*8.), y-i/x));
	

	gl_FragColor = l + vec4(j, j, k, 0.) + i / p * .5;
}