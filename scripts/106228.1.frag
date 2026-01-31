#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float cubic(float x)
{
	return 1.0 - 3.0 * pow(x,2.0) + 2.0 * pow(abs(x),3.0);
}

float linear(float x,float a)
{
	return a * x;
}

float wavelet(float x,float a)
{
	return cubic(x) * linear(x,a);
}

float perlin(float x,float freq)
{
	return 0.0;
}

void main() {

	/*vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );*/
	
	float alpha = 0.0;
		
	if (gl_FragCoord.y >= 100.0)
	{
		alpha = 1.0;
	}
	
	gl_FragColor = vec4(1.0) * alpha;
}