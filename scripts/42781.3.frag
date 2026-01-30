#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

float sphere(vec3 pos, float size)
{
	return length(pos) - size;
}
float box( vec3 p, vec3 b )
{
  return length(max(abs(p)-b,0.0));
}
float torus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

//-----------------------------------------------------------------
float uni( float d1, float d2 )
{
    return min(d1,d2);
}
float substraction( float d1, float d2 )
{
    return max(-d1,d2);
}
float intersection( float d1, float d2 )
{
    return max(d1,d2);
}
vec3 repeat( vec3 p, vec3 c )
{
    return mod(p,c)-0.5*c;
}
vec3 twist( vec3 p )
{
    float c = cos(20.0*p.y);
    float s = sin(20.0*p.y);
    mat2  m = mat2(c,-s,s,c);
    return vec3(m*p.xz,p.y);
}
//-----------------------------------------------------------------

float dist_func(vec3 p)
{
	vec3 p2 = p+vec3(0.1,0.,0.);
	float sp = sphere(p2,0.1);
	float bo = box(p,vec3(0.1));
	
	return min(sp,bo);
	
	//return sphere(repeat(p,vec3(0.5)),0.1);
	//return torus(twist(p),vec2(1.));
	//return torus(p,vec2(1.,0.5));
}
//-----------------------------------------------------------------

void main( void )
{ 
	// 解像度からテクスチャとして利用できる`-1～1`の間に正規化する
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	vec3 cameraPos = vec3(0.0, 0.0, 1.);
	vec3 ray = normalize(vec3(pos, 0.0) - cameraPos);
	vec3 cur = cameraPos;

	vec3 col = vec3(0.0);
		
	for (int i = 0; i < 50; i++)
	{
		float d = dist_func(cur);
		if (d < 0.0001)
		{
			col = vec3(1.);
			break;
		}
		cur += ray * d;
	}
	gl_FragColor = vec4(col, 1.0);
}