#ifdef GL_ES
precision mediump float;
#endif



// Mods By NRLABS 2016

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define OCTAVES 9

float vn(vec2 pos, float persistence, float scale)
{
	float v = 0.0;
	float p = 1.0;
	for (int i=OCTAVES-1; i>=0; --i)
	{
		v += (sin(pos.x)+cos(pos.y))*p;
		pos += sin(pos.yx+vec2(time+cos(time), 0.12345*time));
		p *= persistence;
		pos /= scale;
	}
	return v;
}

void main( void )
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv -= .5;
	float scale = 5.0 +  2.0 * sin(time * .5);
	float r = .5 + .5 * vn(uv*scale, 0.5-abs(cos(time*0.05)), 0.5);
	float g = .5 + .5 * vn(uv*(scale+1.0), .75-abs(sin(time*0.5)), .5);
	float b = .5 + .5 * vn(uv*(scale-1.0), .5, .5);
	
	gl_FragColor = vec4( r,g,b, 1.0 );

}