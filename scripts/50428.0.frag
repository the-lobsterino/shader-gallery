#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool insideTri(vec2 s, vec2 a, vec2 b, vec2 c)
{
    float as_x = s.x-a.x;
    float as_y = s.y-a.y;

    bool s_ab = (b.x-a.x)*as_y-(b.y-a.y)*as_x > 0.;

    if((c.x-a.x)*as_y-(c.y-a.y)*as_x > 0. == s_ab) return false;

    if((c.x-b.x)*(s.y-b.y)-(c.y-b.y)*(s.x-b.x) > 0. != s_ab) return false;

    return true;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	if(insideTri(uv,vec2(0.1,0.1),vec2(0.1,0.8),vec2(0.8,0.1))) color = 1.0;

	gl_FragColor = vec4( vec3(color), 1.0 );

}