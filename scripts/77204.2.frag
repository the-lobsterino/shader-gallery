#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// [ V a p o r w a v e ]

float square(float x) { return x * x; }
float dist(float x1, float y1, float x2, float y2)
{
	return sqrt(square(x2 - x1) + square(y2 - y1));
}
float dist_v2(vec2 p1, vec2 p2)
{
	float x1 = p1.x;
	float y1 = p1.y;
	float x2 = p2.x;
	float y2 = p2.y;
	
	return sqrt(square(x2 - x1) + square(y2 - y1));
}

vec4 image(vec2 coord)
{
	vec4 frag;
	vec2 sp = vec2(cos(time / 4.0) / 5.0, sin(time / 4.0) / 5.0);
	
	vec2 pos = ( coord.xy / resolution.xy ) - vec2(0.5,0.5);	
        float horizon = 0.0; 
        float fov = 0.5; 
	float scaling = 0.1;
	
	vec3 p = vec3(pos.x, fov, pos.y - horizon);      
	vec2 s = sp + vec2(p.x/p.z, p.y/p.z) * scaling;
	
	float color;
	//checkboard texture
	if (pos.y < horizon) {
	  color = sign((mod(s.x, 0.1) - 0.05) * (mod(s.y, 0.1) - 0.05));	
	} else {
	   color = 0.0;
	}
		
	//fading
	color *= p.z*p.z*10.0;
	
	vec3 cc = vec3(color);
	cc.g *= 0.3;
	cc.b *= 1.5;
	
	float sv0 = (1.0 - (coord.y / resolution.y)) * 4.0;
	float sv1 = (1.0 - (coord.y / resolution.y)) * 2.0;
	float sv2 = (1.0 - (coord.y / resolution.y)) * 1.0;
	vec2 sunpos = vec2((resolution.x / 2.0) + 240.0, (resolution.y / 2.0) + 100.0);
	float sundist = dist_v2(sunpos, coord.xy) / 64.0;
	if(gl_FragCoord.y > (resolution.y / 2.0) - 20.0)
	{
		vec3 ac = (vec3(sv0, sv1, sv0) / 2.0);
		ac = ac / sundist;
		cc = (cc + 1.0) * ac;
	}
	else
	{
		vec3 ac = vec3(1.0, 0.55, 0.75) * (1.0 / (sundist / 30.0));
		cc = (cc + 1.0) * (ac / 10.0);
	}
	frag = vec4( cc, 1.0 );
	
	return frag;
}

vec4 blur_func(vec2 coord)
{
	vec4 color = image(coord);
	for(float y = -16.0; y < 16.0; y++)
	{
		for(float x = -16.0; x < 16.0; x++)
		{
			vec2 newpos = coord + vec2(x, y);
			color += (image(newpos) / ((1.0 + dist(x, y, 0.0, 0.0)) * 128.0));
		}
	}
	return color;
}

void main( void ) {
	/*
	vec2 sp = vec2(cos(time / 4.0) / 5.0, sin(time / 4.0) / 5.0);
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	
        float horizon = 0.0; 
        float fov = 0.5; 
	float scaling = 0.1;
	
	vec3 p = vec3(pos.x, fov, pos.y - horizon);      
	vec2 s = sp + vec2(p.x/p.z, p.y/p.z) * scaling;
	
	float color;
	//checkboard texture
	if (pos.y < horizon) {
	  color = sign((mod(s.x, 0.1) - 0.05) * (mod(s.y, 0.1) - 0.05));	
	} else {
	   color = 0.0;
	}
		
	//fading
	color *= p.z*p.z*10.0;
	
	vec3 cc = vec3(color);
	cc.g *= 0.3;
	cc.b *= 1.5;
	
	float sv0 = (1.0 - (gl_FragCoord.y / resolution.y)) * 4.0;
	float sv1 = (1.0 - (gl_FragCoord.y / resolution.y)) * 2.0;
	float sv2 = (1.0 - (gl_FragCoord.y / resolution.y)) * 1.0;
	vec2 sunpos = vec2((resolution.x / 2.0) + 240.0, (resolution.y / 2.0) + 100.0);
	float sundist = dist_v2(sunpos, gl_FragCoord.xy) / 64.0;
	if(gl_FragCoord.y > (resolution.y / 2.0) - 20.0)
	{
		vec3 ac = (vec3(sv0, sv1, sv0) / 2.0);
		ac = ac / sundist;
		cc = (cc + 1.0) * ac;
	}
	else
	{
		vec3 ac = vec3(1.0, 0.55, 0.75) * (1.0 / (sundist / 30.0));
		cc = (cc + 1.0) * (ac / 10.0);
	}
	*/
	vec4 cc = blur_func(gl_FragCoord.xy);
	gl_FragColor = cc;

}