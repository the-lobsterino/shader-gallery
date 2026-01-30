#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float bayer2(vec2 a){
    a = floor(a);
    return fract(dot(a,vec2(.5, a.y*.75)));
}

float bayer4(vec2 a)   {return bayer2( .5*a)   * .25     + bayer2(a); }
float bayer8(vec2 a)   {return bayer4( .5*a)   * .25     + bayer2(a); }
float bayer16(vec2 a)  {return bayer4( .25*a)  * .0625   + bayer4(a); }

float check(vec2 p, float size) 
{
	return mod(floor(p.x * size) + floor(p.y * size),3.0);
}

void main(void) 
{
	vec2 p = ((gl_FragCoord.xy / resolution) - 0.5) * 2.0;
	p.x *= resolution.x/resolution.y;	
	p /= dot(p, p);
	float t = cos(time + distance(p, vec2(0.))) * 0.5;
	p *= mat2(cos(t), -sin(t),
		  sin(t),  cos(t));
	float color = check(p, 2.0) * (1.0 / length(p)) * 0.5;
	
	const float steps = 2.0;
	color = floor(color * steps + bayer16(gl_FragCoord.xy)) / steps;
	
	gl_FragColor.rgb = vec3(color);
}