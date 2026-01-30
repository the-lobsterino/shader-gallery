#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 m = vec2((mouse.x - 0.5) * (resolution.x / resolution.y), mouse.y - 0.5);
float circle(vec2 p, float r)
{
	return length(p) - r;
}

float box(vec2 p, vec2 b)
{
  vec2 d = abs(p) - b;
  return min( max( d.x, d.y), 0.0) + length( max( d, 0.0));
}

float scene(vec2 p)
{
	float d = 999999.0;
	
	d = min(d, circle(p  + vec2(0.1, 0.1), 0.1));
	d = min(d, box(p - m, vec2(0.1)));
	
	d = min(max(d, 0.), 0.1);
	
	return d;
}

vec2 getNormal(vec2 p)
{
	vec2 e=vec2(0.0075,0);
 	return((vec2(scene(p+e.xy)-scene(p-e.xy),
			      scene(p+e.yx)-scene(p-e.yx)
			      )));
}

void main(void) 
{
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv -= vec2(0.5);
	uv.x *= resolution.x / resolution.y;

	vec3 color = vec3(0.);
	
	//float dis = scene(uv);
	
	vec3 n = normalize(vec3(getNormal(uv), 0.009));
	
	color = n;
	
	color = vec3(0., 1., 0.) * dot(n, normalize(vec3(mouse - vec2(0.5), 1.)));
	
	gl_FragColor = vec4(color, 1.0 );

}