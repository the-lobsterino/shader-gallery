#ifdef GL_ES
precision mediump float;
#endif

/*LIGHT TEST*/

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main( void ) 
{
	

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) -0.5;
	
	vec2 m = mouse.xy / resolution.xy;

	vec4 fragColor = vec4( (fract(pow(cos((-4.0 * time ) / length(gl_FragCoord.xy / sin(time))), 200.0)) * time), 
			    sin( length(gl_FragCoord.xy / sin(time) * 400.0) * time) * tan(time), 
			      -rand(vec2(fract(sin(length(gl_FragCoord.xy / rand(vec2(dot(time, time), time)))) * time), time)),
			      1.0 ) 
		
		+ vec4(1.4, 24, 2.4, 0);
	
	
	vec4 lightInfo = vec4(0, 0, 10.0, 1800.0);
	
	float dist = distance(gl_FragCoord.xy, lightInfo.xy);
	if ( dist < lightInfo.w )
	{
		if ( dist > lightInfo.z )
		{
			gl_FragColor = fragColor * pow(((lightInfo.w - dist ) / (lightInfo.w - lightInfo.z)), ((cos(sin(time * 12.0)+ sin(time)) * 0.4)) + 5.0);
		}
		else
		{
			gl_FragColor = fragColor ;
		}
		
	}
	else
	{
		gl_FragColor = vec4(0, 0, 0, 0);
	}
	
		
}