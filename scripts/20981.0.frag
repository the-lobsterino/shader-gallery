#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 resolution;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main()
{

	vec2 position = gl_FragCoord.xy / resolution.xy;
	float star=0.0;
	if(rand(gl_FragCoord.xy/resolution.xy) > 0.99)
	{
		float r=rand(gl_FragCoord.xy);
		star= r*(0.125*sin(time * (r * 5.0) + 20.0 * r) + 0.25);
	}

	//float r=rand(gl_FragCoord.xy);
	//star=r*(0.125*sin(time * (r * 5.0) + 720.0 * r) + 0.55);
	//star-=(rand(gl_FragCoord.xy/resolution.xy)*17.0);
	gl_FragColor=vec4(0.0,0.0,0.0,1.0)+star;
}