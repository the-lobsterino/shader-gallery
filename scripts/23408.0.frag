#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D pb;

void main( void )
{
	// previous
	vec4 pb_color = texture2D(pb, gl_FragCoord.xy / resolution);
	
	// position
	vec2 position = (gl_FragCoord.xy / resolution - 0.5) * 2.0;
	float a = resolution.x / resolution.y;
	position.x *= a;
	gl_FragColor = vec4(-1.-cos(time*0.1+length(position)*9.1));
	// sphere
	for(int i=0; i<8; i++)
	{
		vec2 o = position;
		o += vec2(sin(time + float(i)), sin(time * 2.0 + float(i))*0.5);
		float sphere = 0.01 / length(o);
		
		gl_FragColor += vec4(sphere * (0.25 + max(sin(time + float(i)), 0.0)), sphere * max(sin((time + float(i)) * 2.0), 0.0), sphere * max(sin((time + float(i)) * 2.5), 1.0), 0.0);
	}

	// color
	gl_FragColor += pb_color * 0.5;
}