// Random change by @xprogram
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D lastFrame;
vec3 drawCircle(in vec2 xy)
{
	float num = 300.0;
	mat2 matrix = mat2(-1, -num, num, 1);

	float l = length(matrix * xy);
	float c = sin(length(l));
	return vec3(c,c,c);
}

void main() 
{
	vec2 xy=resolution.xy;xy=-.5*(xy-2.0*gl_FragCoord.xy)/xy.x;
	xy-= normalize(xy)*time*0.05;
	vec3 c=drawCircle(xy);
		
	gl_FragColor = vec4( c, 1.0 );
	
	vec2 dFrame = (mouse-.5)*-3.;
	gl_FragColor = max(gl_FragColor, (
		-0.5*texture2D(lastFrame, fract((dFrame+gl_FragCoord.xy)/resolution))
		+texture2D(lastFrame, fract((dFrame+gl_FragCoord.xy+vec2(.5,.5))/resolution))
		+texture2D(lastFrame, fract((dFrame+gl_FragCoord.xy+vec2(.5,-.5))/resolution))
		+texture2D(lastFrame, fract((dFrame+gl_FragCoord.xy+vec2(-.5,.5))/resolution))
		+texture2D(lastFrame, fract((dFrame+gl_FragCoord.xy+vec2(-.5,-.5))/resolution))
		
	)/3.5 - 0.01);
}