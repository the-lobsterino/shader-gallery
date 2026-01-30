#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float map(vec3 p)
{
	float s = length(p) - 0.9;
	float plane = sdBox(p-vec3(0.,1.,0.),vec3(.8)) ;
	return max(plane,plane);
}

vec3 cnormal(vec3 p)
{
	vec2 e = vec2(.001,.0);
	return normalize(.000001 + map(p) - vec3(map(p - e.xyy),map(p - e.yxy),map(p - e.yyx)));
}


void main( void ) {

	vec2 p = ( gl_FragCoord.xy*2. - resolution.xy )/min(resolution.x,resolution.y) ;
	vec3 cp = vec3(5.5,.0,-5.);
	vec3 target = vec3(0.);
	vec3 cd = normalize(vec3(target - cp));
	vec3 cu  = vec3(0.,1.,0.);
	vec3 cs = normalize(cross(cu , cd));
	cu = normalize(cross(cs,cd));
	
	float fov = 2.5;
	vec3 rd = normalize(vec3(cs * p.x + cu * p.y + cd * fov));
	
	vec3 color = vec3(0.);
	vec3 normal = vec3(.0);
	
	float depth = 0.;
	for(int i = 0; i < 100 ; i++)
	{
		vec3 rp = cp + depth * rd;
		float d = map(rp);
		if(d < 0.0001)
		{
			color = vec3(1.);
			normal = cnormal(rp);
			break;
		}
		depth += d;
	}
	vec3 light = normalize(vec3(.8,.4,.2));
	float diff = clamp(dot(light,normal),0.,1.);
	
	color =diff * color;

	gl_FragColor = vec4(color, 1.0 );

}