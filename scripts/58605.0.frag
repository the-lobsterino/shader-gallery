#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float bayer( vec2 rc )
{
	float sum = 0.0;
	for( int i=0; i<3; ++i )
	{
		vec2 bsize;
		if ( i == 0 ) { bsize = vec2(2.0); } else if ( i==1 ) { bsize = vec2(4.0); } else if ( i==2 ) { bsize = vec2(8.0); };
		vec2 t = mod(rc, bsize) / bsize;
		int idx = int(dot(floor(t*2.0), vec2(2.0,1.0)));
		float b = 0.0;
		if ( idx == 0 ) { b = 0.0; } else if ( idx==1 ) { b = 2.0; } else if ( idx==2 ) { b = 3.0; } else { b = 1.0; }
		if ( i == 0 ) { sum += b * 16.; } else if ( i==1 ) { sum += b * 4.; } else if ( i==2 ) { sum += b * 1.; };
	}
	return sum / 64.;
}

void main( void ) {

float t;
	t = time * 0.91;
    vec2 r = resolution,
    o = gl_FragCoord.xy - r/2.;
    o = vec2(length(o) / r.y - .3, atan(o.y,o.x));    
    vec4 s = 0.08*cos(1.5*vec4(0,1,2,3) + t + o.y + sin(o.y) * cos(t)),
    e = s.yzwx, 
    f = max(o.x-s,e-o.x);

    vec4 color = dot(clamp(f*r.y,0.,1.), 72.*(s-e)) * (s-.1) + f;
	
	float threshold = bayer(gl_FragCoord.xy);
	float pr = step(threshold, float(color.r));
	float pg = step(threshold, float(color.g));
	float pb = step(threshold, float(color.b));
	
    gl_FragColor = vec4(pr,pg,pb, 1.0);

}