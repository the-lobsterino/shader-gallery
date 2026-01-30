precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 iteration(vec2 z0, vec2 z)
{
	return z0 + vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
}

bool escapes(vec2 z0)
{
	vec2 z = z0;
	for(int i = 0; i < 50; i++)
	{
		z = iteration(z0, z);
		if(length(z) > 2.0)
			return true;
	}
	return false;
}

int escapetime(vec2 z0)
{
	vec2 z = z0;
	for(int i = 0; i < 50; i++)
	{
		z = iteration(z0, z);
		if(length(z) > 2.0)
			return i;
	}
	return 10000;
}

vec2 lbisect(vec2 z1, vec2 z2, int layer)
{
	for(int i = 0; i < 5; i++)
	{
		vec2 mid = (z1 + z2) / 2.0;
		if(escapetime(mid) > layer)
			z2 = mid;
		else
			z1 = mid;
	}
	return (z1 + z2) / 2.0;
}

vec2 gbisect(vec2 z1, vec2 z2, int layer)
{
	for(int i = 0; i < 5; i++)
	{
		vec2 mid = (z1 + z2) / 2.0;
		if(escapetime(mid) < layer)
			z2 = mid;
		else
			z1 = mid;
	}
	return (z1 + z2) / 2.0;
}

float line(vec2 z1, vec2 z2, vec2 z, float zoom)
{
	return clamp(1.0 - 150.0 * zoom * abs((z2.y - z1.y)*z.x - (z2.x - z1.x)*z.y + z2.x*z1.y - z2.y*z1.x) / length(z2 - z1), 0.0, 1.0);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 color(int layer)
{
	return layer == 10000 ? vec3(1.0, 1.0, 1.0) : hsv2rgb(vec3(mod(float(layer) / 7.0, 1.0), 1.0, 1.0));
}

int imax(int a, int b)
{
	return a > b ? a : b;
}

void main( void ) {
	vec2 pos = (gl_FragCoord.xy / resolution * 2.0 - 1.0) * max(vec2(1.0, 1.0), resolution.xy / resolution.yx);
	
	vec2 center = vec2(0.155, 1.035);
	float zoom = exp(1.3 - 2.1 * cos(time * 0.3));
	
	vec2 at = pos / zoom - center;
	
	float grid = 0.01 / zoom;
	
	vec2 g11 = at - mod(at + center, grid);
	vec2 g22 = g11 + grid;
	vec2 g12 = vec2(g11.x, g22.y);
	vec2 g21 = vec2(g22.x, g11.y);
	vec2 gp = mod(at, grid) / grid;
	
	int e11 = escapetime(g11);
	int e12 = escapetime(g12);
	int e21 = escapetime(g21);
	int e22 = escapetime(g22);
	
	vec3 clr = vec3(0.0, 0.0, 0.0);
	
	if(e11 < e12 && e11 < e21)
		clr += color(imax(e12, e21)) * line(lbisect(g11, g12, e11), lbisect(g11, g21, e11), at, zoom);
	if(e12 < e11 && e12 < e22)
		clr += color(imax(e11, e22)) * line(lbisect(g12, g11, e12), lbisect(g12, g22, e12), at, zoom);
	if(e21 < e22 && e21 < e11)
		clr += color(imax(e22, e11)) * line(lbisect(g21, g22, e21), lbisect(g21, g11, e21), at, zoom);
	if(e22 < e21 && e22 < e12)
		clr += color(imax(e21, e12)) * line(lbisect(g22, g21, e22), lbisect(g22, g12, e22), at, zoom);
	
	if(e11 < e12 && e11 < e22 && e21 < e12 && e21 < e22)
		clr += color(imax(e12, e22)) * line(lbisect(g11, g12, e11), lbisect(g21, g22, e21), at, zoom);
	if(e11 < e21 && e11 < e22 && e12 < e21 && e12 < e22)
		clr += color(imax(e21, e22)) * line(lbisect(g11, g21, e11), lbisect(g12, g22, e12), at, zoom);
	
	if(e11 > e12 && e11 > e22 && e21 > e12 && e21 > e22)
		clr += color(imax(e11, e21)) * line(gbisect(g11, g12, e11), gbisect(g21, g22, e21), at, zoom);
	if(e11 > e21 && e11 > e22 && e12 > e21 && e12 > e22)
		clr += color(imax(e11, e12)) * line(gbisect(g11, g21, e11), gbisect(g12, g22, e12), at, zoom);
	
	if(e11 > e12 && e11 > e21)
		clr += color(e11) * line(gbisect(g11, g12, e11), gbisect(g11, g21, e11), at, zoom);
	if(e12 > e11 && e12 > e22)
		clr += color(e12) * line(gbisect(g12, g11, e12), gbisect(g12, g22, e12), at, zoom);
	if(e21 > e22 && e21 > e11)
		clr += color(e21) * line(gbisect(g21, g22, e21), gbisect(g21, g11, e21), at, zoom);
	if(e22 > e21 && e22 > e12)
		clr += color(e22) * line(gbisect(g22, g21, e22), gbisect(g22, g12, e22), at, zoom);
	
	gl_FragColor += vec4(clr, 1.0);
}