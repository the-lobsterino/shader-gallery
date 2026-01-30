#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

//Test storing 32-bit integers in vec4s where each component holds 8 bits (0-255)

void WriteInt(vec2 pos,float num)
{
	num = floor(num);
	vec4 nybles = vec4(0);
	
	if(floor(gl_FragCoord.xy) == floor(pos))
	{
		nybles.x = mod(floor(num / pow(256.0,0.0)), 256.0) / 255.0;
		nybles.y = mod(floor(num / pow(256.0,1.0)), 256.0) / 255.0;
		nybles.z = mod(floor(num / pow(256.0,2.0)), 256.0) / 255.0;
		nybles.w = mod(floor(num / pow(256.0,3.0)), 256.0) / 255.0;
		
		gl_FragColor = nybles;
	}
}

float ReadInt(vec2 pos)
{
	vec4 nybles = texture2D(backbuffer,floor(pos)/resolution);
	float acc = 0.0;
	
	acc += floor(nybles.x * 255.0 * pow(256.0,0.0));
	acc += floor(nybles.y * 255.0 * pow(256.0,1.0));
	acc += floor(nybles.z * 255.0 * pow(256.0,2.0));
	acc += floor(nybles.w * 255.0 * pow(256.0,3.0));
	
	return acc;
}

vec3 Point(vec2 pos,vec2 p)
{
	return vec3(smoothstep(16.0,15.0,distance(pos,p)));
}

void main( void ) {

	vec2 p = gl_FragCoord.xy;
	vec2 mpos = mouse*resolution;
	
	vec2 lmpos = vec2(0);
	lmpos.x = ReadInt(vec2(0,0));
	lmpos.y = ReadInt(vec2(1,0));
	
	vec3 color = vec3(0.0);
	
	color += Point(lmpos,p);

	gl_FragColor = vec4( color, 1.0 );
	
	WriteInt(vec2(0,0),mpos.x);
	WriteInt(vec2(1,0),mpos.y);
}