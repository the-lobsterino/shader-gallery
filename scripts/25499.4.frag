#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform sampler2D backbuffer;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 PrsntChrioma = vec3(1.,.97,.93);
vec3 HistoChrioma = vec3(.98,.96,.96);
void main( void ) {
	float center = texture2D(backbuffer, gl_FragCoord.xy / resolution.xy).a;
	
	vec2 R = 1./resolution.xy;
	vec2 M = vec2(0)+floor((.5-mouse)*5.);
	
	int neighbors = 0;
	
	if (texture2D(backbuffer, fract((gl_FragCoord.xy + M +vec2(0,1)) * R)).a > 0.5) neighbors++;
	if (texture2D(backbuffer, fract((gl_FragCoord.xy + M +vec2(1,1)) * R)).a > 0.5) neighbors++;
	if (texture2D(backbuffer, fract((gl_FragCoord.xy + M +vec2(1,0)) * R)).a > 0.5) neighbors++;
	if (texture2D(backbuffer, fract((gl_FragCoord.xy + M +vec2(1,-1)) * R)).a > 0.5) neighbors++;
	if (texture2D(backbuffer, fract((gl_FragCoord.xy + M +vec2(0,-1)) * R)).a > 0.5) neighbors++;
	if (texture2D(backbuffer, fract((gl_FragCoord.xy + M +vec2(-1,-1)) * R)).a > 0.5) neighbors++;
	if (texture2D(backbuffer, fract((gl_FragCoord.xy + M +vec2(-1,0)) * R)).a > 0.5) neighbors++;
	if (texture2D(backbuffer, fract((gl_FragCoord.xy + M +vec2(-1,1)) * R)).a > 0.5) neighbors++;
	
	if (center > 0.5 )
	{
		if ( neighbors < 2 )
		{
			center = 0.0;
		}
		else if ( neighbors > 3 )
		{
			center = 0.0;
		}
		else
		{
			center = 1.0;
		}
	}
	else
	{
		if ( neighbors == 3 )
		{
			center = 1.0;
		} else {
			center = 0.0;
		}
	}
	
	
	gl_FragColor = vec4(center);
	
	if ( gl_FragCoord.x <= 1.0 || gl_FragCoord.y <= 1.0 || gl_FragCoord.x >= resolution.x - 1.0 || gl_FragCoord.y >= resolution.y - 1.0 )
	{
		gl_FragColor = vec4(int(sin(length(mouse-.5)*100.*time + ((1./gl_FragCoord.x) + (1./gl_FragCoord.y)) * 1e5 + gl_FragCoord.x * 5. + gl_FragCoord.y * 7. ) > 0.0));
	}
	
	
	vec4 el_LastColor = texture2D(backbuffer, gl_FragCoord.xy*R);
	gl_FragColor.rgb += HistoChrioma*(el_LastColor.rgb-gl_FragColor.rgb);
	gl_FragColor.rgb *= PrsntChrioma;
}
