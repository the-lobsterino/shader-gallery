#ifdef GL_ES
precision mediump float;
#endif
// Amiga decruncher v0.0000002
// not finished yet
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const float PI = 3.14159265358979323846264;

void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	
	uv.x *= resolution.x/ resolution.y;

	
	
	float a = atan(uv.x, uv.y ) * 64./PI;
	float r = length(uv);

	// 3 variables in vec3 x,x,x .. mix all math components !
	vec3 Color1 = vec3( -tan(time), sin(time),64.*sin(time)) ;
	
	vec3 Color2 = vec3(sin(5.*uv.y - 8.+time));
	
	vec3 Color3 = vec3(cos(10.*uv.y * 6.+time));
	
	
	vec3 FinalColor= mix( -sin(Color1*time), cos(Color2*time), -sin(Color3)) ;
	
	gl_FragColor = vec4(FinalColor, 1.);
}
