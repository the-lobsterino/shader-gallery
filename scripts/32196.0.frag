precision mediump float;
uniform vec2  m;       // mouse
uniform float t;       // time
uniform vec2  r;       // resolution
uniform sampler2D smp; // prev scene


uniform vec2 centre(0.5, 0.5);
float radius = 0.5;

void main()
{
	gl_FragColor = v_color * texture2D(u_texture, v_texCoord);
	float dist = length(v_texCoord - centre);
	if(dist < radius)
	{
		gl_FragColor.r = 1.0;
	}
}