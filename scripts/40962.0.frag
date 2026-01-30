precision lowp float;
uniform vec2 resolution;

float r=200.;

void main()
{
	vec2 p=gl_FragCoord.xy-resolution.xy/2.;
	float h=sin(2.94)*r;
	gl_FragColor=vec4(length(p+vec2(r/5.,h))<r && length(p+vec2(-r/5.,h))<r && length(p-vec2(0.,h))<r);
}