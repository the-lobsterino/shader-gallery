#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D b;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float fbm(in vec2 p)
{	
	float z=2.;
	float rz = 0.;
	vec2 bp = p;
	for (float i= 1.;i < 6.;i++)
	{
		rz+= abs((rand(p)-0.5)*2.)/z;
		z = z*2.;
		p = p*2.;
	}
	return rz;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) ;

	float ns = rand(uv)* (1.0 + 0.5 * cos(time));
	float r = 0.2;
	gl_FragColor = vec4( step(length(uv - 0.5), r) ) + texture2D(b, (1.0 + 0.001 * ns) * (uv + sin(uv.x + 10.5 * ns) * 0.001 - mouse) * 0.99 + mouse) * 0.98; 
}