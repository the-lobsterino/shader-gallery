// 200820N strange ... Mandelbrot is everwhere.... ^^(hihi)^^

/* Quadric Bezier curve */

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;


#define MAX_ITERATION 120.
float mandelbrot(vec2 c)
{
	vec2 z = c;
	float count = 0.0;
	float t = time*0.2;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) -c; // z*cos(t)+c*sin(t);
		if (length(z) > 2.0) break;
		
		count += 1.0;
	}

	float re = (length(z*count/MAX_ITERATION));
	if (re <= 0.0)
		return 1.;
	return re;
}



#define sat(val) clamp((val), 0.0, 1.0)

vec4 grid(vec2 pos)
{
	float v = floor(1.003 - fract((pos.x))) + floor(1.003 - fract((pos.y)));
	return vec4(v, v, v, 1.0);
}

bool partDot(vec2 point, vec2 p)
{
	return length(point - p) < 0.07;
}
	

void main( void ) {
	vec2 p = ((gl_FragCoord.xy - resolution / 2.0) / max(resolution.x/2.0, resolution.y/2.0) ) * 4.0;
	vec2 pm = ((mouse.xy - 0.5) / (max(resolution.x/2.0, resolution.y/2.0) / resolution)) * 4.0; 
	
	float mb = mandelbrot(p);
	
	vec2 r0 = vec2(-1.0, 1.0);
	vec2 r1 = pm;
	vec2 r2 = vec2(0.0, -1.0);
	
	vec2 a = r0 - 2.0 * r1 + r2;
	vec2 b = -2.0 * (r0 - r1);
	vec2 c = r0 - p;
	float t1 = (-b.x + sqrt(b.x*b.x - 4.0*a.x*c.x)) / (2.0 * a.x);
	float t2 = (-b.x - sqrt(b.x*b.x - 4.0*a.x*c.x)) / (2.0 * a.x);
	float ty1 = (-b.y + sqrt(b.y*b.y - 4.0*a.y*c.y)) / (2.0 * a.y);
	float ty2 = (-b.y - sqrt(b.y*b.y - 4.0*a.y*c.y)) / (2.0 * a.y);
	
	float ttx = (r0.x - r1.x + sqrt((r0.x-2.0*r1.x+r2.x)*p.x + r1.x*r1.x - r0.x*r2.x)) / (r0.x - 2.0 * r1.x + r2.x);
	float tty = (r0.y - r1.y + sqrt((r0.y-2.0*r1.y+r2.y)*p.y + r1.y*r1.y - r0.y*r2.y)) / (r0.y - 2.0 * r1.y + r2.y);
	
	float fn = (1.0 - t1)*(1.0 - t1)*r0.y + 2.0 * t1 * (1.0 - t1)*r1.y + t1*t1 * r2.y - p.y;
	float fn2 = (1.0 - t2)*(1.0 - t2)*r0.y + 2.0 * t2 * (1.0 - t2)*r1.y + t2*t2 * r2.y - p.y;
	float fxn1 = (1.0 - ty1)*(1.0 - ty1)*r0.x + 2.0 * ty1 * (1.0 - ty1)*r1.x + ty1*ty1 * r2.x - p.x;
	float fxn2 = (1.0 - ty2)*(1.0 - ty2)*r0.x + 2.0 * ty2 * (1.0 - ty2)*r1.x + ty2*ty2 * r2.x - p.x;

	float fty = (1.0 - tty)*(1.0 - tty) * r0.y + 2.0*ttx*(1.0-tty) * r1.y + tty * tty * r2.y - p.y;

	float f1 = (r0.y - p.y) * (r1.x - r0.x) + (p.x - r0.x) * (r1.y - r0.y);
	float f2 = (r1.y - p.y) * (r2.x - r1.x) + (p.x - r1.x) * (r2.y - r1.y);
	//vec4 color = (2.0 < ty1 && ty1 < 3.0) ? vec4(floor(1.006 - abs(f1)),floor(1.06 - abs(fxn2)),floor(1.006 - abs(f2)),1.) : vec4(0.0);
	vec4 color = vec4((1.006 - abs(f1)),sat((1.06 - abs(mb+fxn2))) + sat((1.06 - abs(fxn1))),(1.006 - abs(f2)),1.);
	color = sat(color);
	color += grid(p);
	color += partDot(r0, p) ? vec4(0.0, 0.8, 0.8, 1.0 ) : vec4(0.);
	color += partDot(r1, p) ? vec4(0.0, 0.8, 0.8, 1.0 ) : vec4(0.);
	color += partDot(r2, p) ? vec4(0.0, 0.8, 0.8, 1.0 ) : vec4(0.);
	gl_FragColor = sat(color);
}

