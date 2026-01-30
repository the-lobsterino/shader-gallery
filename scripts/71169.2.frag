#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(vec2 p)
{
	float v = 0.0;	
	float n = 0.0;
	
	for(int i = 0;i < 5;i++)
	{
		v += sin(p.x*n+time * 5.0)*sin(p.y*n);
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
float PI=3.1412;
	vec2 res = vec2(resolution.x/resolution.y,1);
	vec2 p = ( gl_FragCoord.xy / resolution.y ) - res/2.0;
	p *= 7.0 + sin(time*.15) + 2. * cos(time*.5);

		vec3 col = vec3(0.2);
	for(int i=0; i<10; i++) {
		float a = 2.0*PI*float(i)/12.0 + time*0.2;
		float x = cos(time)*cos(a)-sin(a*2.0+sin(time));
		float y = sin(time)*sin(a-time+cos(time)*5.)+sin(time)*cos(a-time);
		vec2 q = 7. * cos(time)*vec2(x,y);
		float r = fract(pow(a,sin(time)));
		float g = 1.0-r;
		col += 0.05/length(p-q)*vec3(r, g, 0.01);
	}
	
	
	float c, c1, c2, c3 = 0.0;
	
	c = abs(f(p))/length(df(p));
	c1 = smoothstep(0.000,8.0/resolution.x,c);
	c2 = smoothstep(0.02,5.0/resolution.x,c);
	c3 = smoothstep(0.001,0.0/resolution.x,c);
        c3 = col.r;
	vec3 pat = vec3(c,c2,0.);
	vec3 o = mix(pat, col * mat3(sin(time),-cos(time),1.,cos(time),sin(time),1.,0.,0.,1.), vec3(0.65));
	gl_FragColor = vec4( o , 1.0 );

}