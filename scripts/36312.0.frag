#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.1415926535

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate(float t)
{
	return mat2(cos(t), sin(t), -sin(t), cos(t));
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy - resolution.xy / 2.0 ) / resolution.y;

	float color = 0.0;
	vec2 id = floor(pos / 0.2);
	float speed = sin(time + id.y * 4.0) * 1.0;
	pos.x += speed;
	id = floor(pos / 0.2);
	pos = mod(pos, 0.2) - 0.1;
	
	if (mod(id.x, 2.0) < 1.0)
	{
		pos = rotate(time * -1.0 * speed * 0.03  + id.x) * pos;
	}
	else
	{
		pos = rotate(time * -1.0 * speed * 0.03 * 1.0 + id.x) * pos;
	}
	
	if (dot(pos, rotate(0.0) * vec2(0, -1)) < 0.05
	   && dot(pos, rotate(PI / 3.0 * 2.0) * vec2(0, -1)) < 0.05
	   && dot(pos, rotate(PI / 3.0 * 4.0) * vec2(0, -1)) < 0.05)
	{
		color = 1.0;
	}

	gl_FragColor = vec4(mix(vec3(1.,0.5,0.),vec3(1.,1.,.2),color),1.);

}