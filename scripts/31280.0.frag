#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//based on http://glslsandbox.com/e#27191.0

void main( void ) 
{
	float t = pow(3.,fract(time));
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	//uv = vec2(uv.y,uv.x);
	vec2 scale	= vec2(2047., .3);

	//floored components 
	vec2 position	= fract(uv * vec2(1., 1.) ) * scale * (vec2(2.+(t*2.),10.+(t/2.6))) * 10.;
	position	= ceil(position);
	
	float bit 	= position.x;
	
	float v = position.y;
	float exponent 	= pow(2., v);
	float rotation 	= pow(2., v+1.);	
	
	//gray encoding
	gl_FragColor = vec4(floor(mod(position.x + exponent / 2., rotation)/exponent));
}