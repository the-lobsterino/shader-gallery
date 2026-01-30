#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(vec2 p)
{
	float v = 0.0;	
	float n = 0.0;
	
	for(int i = 0;i < 10;i++)
	{
		v += sin(p.x*n+time)*sin(p.y*n);
		n++;
	}
	
	return v;	
}

vec2 df(vec2 p)
{
	vec2 h = vec2(0.01,0);
	return vec2(f(p+h.xy) - f(p-h.xy),f(p+h.yx) - f(p-h.yx))/h.x;
}

void main( void ) {

	vec2 res = vec2(resolution.x/resolution.y,1);
	vec2 p = ( gl_FragCoord.xy / resolution.y ) - res/2.0;
	p *= 8.0;

	float c = 0.0;
	
	c = abs(f(p))/length(df(p));
	
	c = smoothstep(0.000,8.0/resolution.x,c);
	gl_FragColor = vec4( vec3( c ), 1.0 );

}