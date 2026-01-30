#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_DIGITS 8

// re-refactored again
// each display()'s local space origin is its decimal point
// mouse debug is x/y pixel on left, normalized UV coord on right
// use a higher res

float box( vec2 p, vec4 rect)
{
    float trim = min(rect.z, rect.w) * 0.5;
    float minX = min(p.x - rect.x, rect.x + rect.z - p.x);
    float minY = min(p.y - rect.y, rect.y + rect.w - p.y);
    return step(0.0, minX) * step(0.0, minY) * step(trim, minX + minY);
}

float digit( vec2 p, vec4 dim, float d)
{
	d = (d - mod(d,1.0)) / 10.0;
	d = mod( d, 1.0 );

	p.xy -= dim.xy;
	p.xy /= dim.zw;
	

	float c = 0.0;
	
	// I'm sure all of these can be improved... in fact, this way may actually be slower than just if else if else if else for
	// all ten numbers.  Oh well, it was worth a shot :)
	
	// ed: removed all conditional expressions, should work everywhere

	// top - 0, 2, 3, 5, 7, 8, 9
	c += box(p, vec4(0.05, 0.9, 0.9, 0.1)) * step(cos((0.85*d+0.1)*30.0) - sin(pow(d,1.0)), 0.0);

	// middle - 2, 3, 4, 5, 6, 8, 9
	c += box(p, vec4(0.05, 0.45, 0.9, 0.1)) * step(1.0, min(pow(6.0*d,2.0), pow(20.0*(d-0.7),2.0)));

	// bottom - 0, 2, 3, 5, 6, 8
	c += box(p, vec4(0.05, 0.0, 0.9, 0.1)) * step(0.0, max(cos(18.6*pow(d,0.75)), 1.0-pow(40.0*(d-0.8),2.0)));

	// bottom left - 0, 2, 6, 8
	c += box(p, vec4(0.0, 0.08, 0.1, 0.39)) * step(0.1, cos(d*30.0) * abs(d-0.4));
	
	// bottom right - 0, 1, 3, 4, 5, 6, 7, 8, 9
	c += box(p, vec4(0.9, 0.08, 0.1, 0.39)) * step(0.1, pow(4.0*d-0.8, 2.0));

	// top left - 0, 4, 5, 6, 8, 9
	c += box(p, vec4(0.0, 0.52, 0.1, 0.39)) * step(sin((d-0.05)*10.5) - 12.0*sin(pow(d,10.0)), 0.0);
	
	// top right - 0, 1, 2, 3, 4, 7, 8, 9
	c += box(p, vec4(0.9, 0.52, 0.1, 0.39)) * step(0.02, pow(d-0.55, 2.0));

	return c;
}


float display(vec2 uv, int frac_digits, vec2 position, vec2 size, float spacing, float v)
{
	float d = 0.0;
	for (int i = 0; i < MAX_DIGITS; ++i)
	{
		float pvalue = pow(10.0, float(i-frac_digits));
		d += step(pvalue, v) * 
			digit(uv, vec4(position.x + spacing*0.7 - (size.x+spacing)*float(i-frac_digits+1), position.y, size), v/pvalue);
	}
	// decimal pt
	d += box(uv, vec4(position, size*0.1));
	return d;
}


void main(void)
{
	vec3 color = vec3(0.1, 0.7, 1.0);
	vec2 p = (gl_FragCoord.xy / resolution);
	float c = 0.0;

	c += display(p, 2, vec2(0.7,0.35), vec2(0.06, 0.37), 0.01, time);
	c += display(p, MAX_DIGITS-1, mouse+vec2(0.02,0.00), vec2(0.01,0.02), 0.001, mouse.x);
	c += display(p, MAX_DIGITS-1, mouse+vec2(0.02,-0.03), vec2(0.01,0.02), 0.001, mouse.y);
	c += display(p, 0, mouse+vec2(-0.02,0.00), vec2(0.01,0.02), 0.001, mouse.x*resolution.x);
	c += display(p, 0, mouse+vec2(-0.02,-0.03), vec2(0.01,0.02), 0.001, mouse.y*resolution.y);

#if 0
	c += digit( p, vec4( 0.0, 0.1, 0.09, 0.1 ), 0.0 );
	c += digit( p, vec4( 0.1, 0.1, 0.09, 0.1 ), 1.0 );
	c += digit( p, vec4( 0.2, 0.1, 0.09, 0.1 ), 2.0 );
	c += digit( p, vec4( 0.3, 0.1, 0.09, 0.1 ), 3.0 );
	c += digit( p, vec4( 0.4, 0.1, 0.09, 0.1 ), 4.0 );
	c += digit( p, vec4( 0.5, 0.1, 0.09, 0.1 ), 5.0 );
	c += digit( p, vec4( 0.6, 0.1, 0.09, 0.1 ), 6.0 );
	c += digit( p, vec4( 0.7, 0.1, 0.09, 0.1 ), 7.0 );
	c += digit( p, vec4( 0.8, 0.1, 0.09, 0.1 ), 8.0 );
	c += digit( p, vec4( 0.9, 0.1, 0.09, 0.1 ), 9.0 );
#endif

	
	gl_FragColor = vec4(c * color, 1.0 );
}