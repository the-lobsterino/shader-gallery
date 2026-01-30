#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {	
	
	/*
	vec2 p=(gl_FragCoord.xy*2.0-resolution)/min(resolution.x,resolution.y);
	vec3 f;
	
	for(float i=0.0;i<7.0;++i)
	{
		vec2 q;
		if(i==0.0)
		{
			q.x=p.x/cos(time);
			q.y=p.y/sin(time);
			f+=0.15/length(q);
		}
		else
		{
			q.x=p.x+cos(time+i);
			q.y=p.y+sin(time+i);
			f+=0.03/length(q);
		}
	}
	gl_FragColor=vec4(f.x*cos(time)-0.5,f.y,f.z*1.3,1.0);
	*/
	
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	uv *= 2.;
	vec3 col = vec3(0.);
	float d = length(uv);
	col += .05 / d;
	float n = 6.28 / 6.;
	float a = mod(atan(uv.y, uv.x), n) - n * 0.5;
	d = length(length(uv) * vec2(cos(a), sin(a)) - vec2(1., 0.));
	col += .05 / d;
	col *= vec3(0, 1, 1);
	gl_FragColor = vec4(col, 1.);

}