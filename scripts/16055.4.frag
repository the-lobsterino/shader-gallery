#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 triangle(vec2 p, vec2 p0, vec2 p1, vec2 p2)
{
	float A = 0.5 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    	float sgn = A < 0.0 ? -1.0 : 1.0;
    	float s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sgn;
    	float t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sgn;
    
    	bool isin = s > 0.0 && t > 0.0 && (s + t) < 2.0 * A * sgn;
	
	if(isin)	
	{
		return vec3(s, t, 1.0);	
	}
	else
	{
		return vec3(0.0);	
	}
}

void main( void ) {
	vec2 uv =  gl_FragCoord.xy / resolution.xy;
	vec2 aspect = vec2( resolution.x / resolution.y, 1.0 );
	vec2 p = ( uv * 2.0 - 1.0 ) * aspect;
	vec2 mt = ( mouse * 2.0 - 1.0 ) * aspect;
	const float scale = 2.3;
	p *= scale;
	mt *= scale;
	vec3 c;
	vec2 p0,p1,p2;
	p0 = mt;//vec2(0.0, 0.0);
	p1 = vec2(0.5, 1.0);
	p2 = vec2(1.0, -1.0);
	vec3 p0c, p1c, p2c;
	
	p0c = vec3(0.0, 0.0, 1.0);
	p1c = vec3(1.0, 0.0, 0.0);
	p2c = vec3(0.0, 1.0, 0.);
	
	vec3 ret = triangle(p, p0, p1, p2);
	ret.x /= distance(p1, (p0 + p2)*0.5);
	ret.y /= distance(p1, (p0 + p2)*0.5);
	
	if(ret.z != 0.0)
	{
		c = vec3(ret.x, ret.y, 1.0 - ret.x - ret.y);	
		c = mix(p1c, mix(p0c, p2c, ret.y), 1.0 - ret.x);
	}
	
	gl_FragColor = vec4( c, 1.0 );

}