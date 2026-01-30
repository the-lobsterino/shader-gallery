#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{	
	float dotInteral = 100.;
	float dotSize = 50./2.; // diameter 
	vec2 pos = mod(gl_FragCoord.xy, vec2(dotInteral)) - vec2(dotInteral/2.) + vec2(dotSize);
	float radius = length(pos-vec2(dotSize)); //dot(pos, pos);
	
    vec4 foreground_color = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 background_color = vec4(0.0, 0.0, 0.0, 1.0);
	
	gl_FragColor = mix(foreground_color, background_color, smoothstep(dotSize,dotSize*1.05, radius));
	//gl_FragColor = mix(foreground_color, background_color, step( 300., dist_squared));
}