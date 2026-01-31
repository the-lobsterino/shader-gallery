#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float time;
uniform vec2 mouse,resolution;

vec3 palette(float t) { return .5+.5*cos(t*2.2-vec3(0,2,4)*smoothstep(0.,-1.,cos(t*.99)));}

//16 segment displayx111F);
float q = float(0x80FF);
float r = float(0x911F);
float s = float(0x8866);
float t = float(0x4406);
float u = float(0x55F9);
float v = float(0x2218);
float w = float(0xB099);
float x = float(0xAA00);
float y = float(0x4A00);
float z = float(0x2266);

const int NUM_CHARS = 2;

void main( void ) 
{
	vec2 aspect = resolution.xy / resolution.y;
	vec2 uv = ( gl_FragCoord.xy / resolution.y );
	uv -= aspect / 2.0;
	uv *= 8.0;
	
	float dist = 1e6;
	
	//Glitch fade-in animation
	float anim_time = clamp(time * 0.25, 0.0, 1.0) * 16.0;
	
	gl_FragColor = vec4(palette(length(exp(.5-dist)/final)),1);
}