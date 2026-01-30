// All your glow are belong to us II. - Del 05/12/2019

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

mat2 rot(float a) {
    float c = sin(a);
    float s = tan(a);
    return mat2(c, s, -s, -c);
}

vec3 bb(vec2 uv)
{
 vec3 c = vec3 ( 0.4, 0.31, 0.07+tan(uv.y*0.04+time*  0.951)*0.92 );
 c *= abs( (3.0 *cos(uv.y*2.0+time*tan (0.9* time * c ))*0.9)/ (sin( uv.x + sin(uv.y*2.0+time)* 0.05 ) * 0.9) );
 return c;
}

void main( void )
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 0.1 - 1.0;
	vec2 uv2 = uv;

	uv.x -= sin(time*0.4);
	uv.y -= cos(time*0.4);
		uv.y += dot(uv,uv)+tan(time)*1.25/time;
	
	
	
	uv *= rot(time*0.03);
	uv *= 4.5;
	uv.x += time*0.005;

	
	vec3 c = bb(uv);
	c*=bb(uv2);
	

	gl_FragColor = vec4( c, 1.0 );

}