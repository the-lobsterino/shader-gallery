#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define OCTAVES 12


float vn(vec2 pos, float persistence, float scale)
{
	float v = 0.0;
	float p = 1.0;
	for (int i=OCTAVES-1; i>=0; --i)
	{
		v += (sin(pos.x*1.2)+cos(pos.y/2.0))*p;
		pos += sin(pos.yx+vec2(0.125 * time+ 0.025* cos(0.5 * time), 0.32345*time));
		p *= persistence;
		pos /= scale;
	}
	return v;
}

void main( void )
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );

	float c = vn(uv*10.0, 0.6, 0.45);

	gl_FragColor = vec4( vec3( cos(c*1.0)*0.25+0.35 ), 1.0 );
	gl_FragColor.r += 0.03;

}