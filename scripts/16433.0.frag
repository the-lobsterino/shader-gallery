//work in progress..
//http://en.wikipedia.org/wiki/File:RyujoFlightdeck.jpg
#ifdef GL_ES
precision mediump float; //g
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_DIST  1000.0

float rand(vec2 n)
{
	return fract(sin(n.x*5442.6542+n.y*5253.6531)*4334.5365);
}

mat3 rot(float t)
{
	return mat3(
		cos(t), -sin(t), 0,
		sin(t),  cos(t), 0,
		     0,       0, 1);
}


vec2 map(vec3 p)
{
	p = p.zyx;
	float i = 0.0;
	float m = 0.0;
	float t = MAX_DIST;
	float w = 0.0;
	float k = -time * 3.0;

	
	//body
	w = length(p * vec3(0.3,1,1)) - 5.0;
	if(w < t)
	{
		i = 2.0;
		t = w;
	}

	//deck
	t = length(  max(abs(p + vec3(0,-5,0)) - vec3(13.0,0.1,2.4 + cos(0.3 + p.x * 0.04)) * 2.0, 0.0) ) - 0.5;
	if(w < t)
	{
		i = 3.0;
		t = w;
	}
	
	//sea
	w = 0.1 + dot(p, vec3(0, 1, 0)) + sin(0.7 * k + p.x) + sin(0.3 * k + p.y) * 0.3 + cos(0.1 * k + p.z) * 0.3;
	if(w < t)
	{
		i = 5.0;
		t = w;
	}
	return vec2(t, i);
}

vec2 rrt(vec2 dir, float a)
{
	return vec2(
		dir.x * cos(a) - dir.y * sin(a),
		dir.x * sin(a) + dir.y * cos(a));
}

void main( void ) {
	vec2 uv = -1.0 + 2.0 * ( gl_FragCoord.xy / resolution.xy );
	uv.x *= resolution.x / resolution.y;
	vec3 dir = normalize(vec3(uv, 1.0));
	//dir = dir.yzx * rot(3.);
	//dir = dir.yzx * rot(0.03);
	//dir = dir.xzy * rot(3.14 * 90.0);
	//dir.xz =rrt( dir.xz, 0.3);
	dir.xy =rrt( dir.xy, 1.0);
	dir.yz =rrt( dir.yz, 1.1);
	
	vec3 pos = vec3(02.0, 15, -20.0);
	float t = 0.0;
	vec2 e;
	for(int i = 0 ; i < 35; i++)
	{
		e = map(pos + dir * t);
		if(e.x < 0.001) break;
		t += e.x;
	}
	vec3 ip  =pos + dir * t;
	vec4 c = vec4(0);
	c += vec4(t * 0.01) * map(ip + 0.5).x;
	if(e.y == 2.0) {
		//wood deck
		c += abs(pow(cos(clamp(ip.z  +10.0, -1.0, 1.0)), 384.0) )  * abs(cos(ip.x * 0.5));
		
		//center v line
		c += abs(pow(cos(clamp(ip.z  + 7.0, -1.0, 1.0)), 32.0) )  * cos(ip.x * 0.1);
		
		//center white line.
		c += abs(pow(cos(clamp(ip.x  + 0.0, -1.0, 1.0)),  64.0) ) * abs(sin(ip.z * 3.0) > 0.5 ? 0.0 : 1.0);
		
		//half white line.
		c += abs(pow(cos(clamp(ip.x  - 1.0, -1.0, 1.0)), 256.0) )   * (ip.z > -7.0 ? 0.0 : 1.0) * (ip.z < -15.0 ? 0.0 : 1.0);
		c += abs(pow(cos(clamp(ip.x  + 1.0, -1.0, 1.0)), 256.0) )   * (ip.z > -7.0 ? 0.0 : 1.0) * (ip.z < -15.0 ? 0.0 : 1.0);
		
		//top side line 1,2
		c += abs(pow(cos(clamp(ip.x  - 4.0, -1.0, 1.0)), 128.0) )   * (ip.z > 5.0 ? 0.0 : 1.0);
		c += abs(pow(cos(clamp(ip.x  + 4.0, -1.0, 1.0)), 128.0) )   * (ip.z > 5.0 ? 0.0 : 1.0);
		
		//bottom side line 1, 2.
		c += abs(pow(cos(clamp(ip.x  + 5.0, -1.0, 1.0)), 128.0) )   * (ip.z < 0.0 ? 0.0 : 1.0) *  (ip.z > 22.0 ? 0.0 : 1.0);
		c += abs(pow(cos(clamp(ip.x  - 5.0, -1.0, 1.0)), 128.0) )   * (ip.z < 0.0 ? 0.0 : 1.0) *  (ip.z > 22.0 ? 0.0 : 1.0);
		
		//bottom box.
		c += abs(pow(cos(clamp(ip.z  - 5.0,  -1.0, 1.0)), 128.0) )  * (cos(ip.x * 0.25) > 0.3 ? 1.0 : 0.0);
		c += abs(pow(cos(clamp(ip.z  - 0.0,  -1.0, 1.0)), 128.0) )  * (cos(ip.x * 0.25) > 0.3 ? 1.0 : 0.0);
		c += abs(pow(cos(clamp(ip.z   -8.0,  -1.0, 1.0)), 128.0) )  * (cos(ip.x * 0.25) > 0.3 ? 1.0 : 0.0);
		c += abs(pow(cos(clamp(ip.z  -12.0,  -1.0, 1.0)), 128.0) )  * (cos(ip.x * 0.25) > 0.3 ? 1.0 : 0.0);
		c += abs(pow(cos(clamp(ip.z  -20.0,  -1.0, 1.0)), 128.0) )  * (cos(ip.x * 0.25) > 0.3 ? 1.0 : 0.0);
		c += abs(pow(cos(clamp(ip.z  -22.0,  -1.0, 1.0)), 128.0) )  * (cos(ip.x * 0.25) > 0.3 ? 1.0 : 0.0);

		//circle
		vec2 sp = ip.xz + vec2(0, -14.0);
		float l = length(sp);
		c += (l < 2.2 ? 1.0 : 0.0) * (l > 2.0 ? 1.0 : 0.0);
		
		//bottom shimashima.
		c += sin(3.0 * ip.x * (ip.z > 24.0 ? 1.0 : 0.0));
		c *= 0.5 * vec4(3,2,1,0) * sin(2.0 * sin(19.0 * ip.x + rand(vec2(ip.xz) * 50.0 )));
		
	}
	
	if(e.y >= 5.0)
	{
		c *= vec4(1,2,3,4) * 0.1;
	}

	gl_FragColor = vec4(sqrt(length(c)));

}