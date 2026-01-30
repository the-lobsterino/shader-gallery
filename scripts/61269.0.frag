// Port of "Nibbler" by procra
// https://www.shadertoy.com/view/3lj3zc
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution

float index = 6.;

vec4 color(int r, int g, int b, int a)
{
	return (vec4(float(r) / 255.0, float(g) / 255.0, float(b) / 255.0, float(a) / 255.0));
}


vec4 bg(vec2 fragCoord)
{
	vec4 firstCol = color(0x16, 0x18, 0x1e, 0xff);
	vec4 secondCol = color(0x22, 0x28, 0x3a, 0xff);
	vec4 thirdCol = color(0x08, 0x09, 0x0B, 0xff);

	vec2 pos = (fragCoord.xy) / iResolution.xy;
	vec2 tex;

	vec2 fromCenter = vec2(abs(pos.x - 0.5), abs(pos.y - 0.5));
	float stripe;
	float fromBorder = max(fromCenter.x, fromCenter.y);

	if (fromCenter.x > fromCenter.y)
	{
		stripe = mod(fromCenter.x + (1. - iTime * 4.) * .05, .05);
	}
	else
	{
		stripe = mod(fromCenter.y + (1. - iTime * 4.) * .05, .05);
	}

	vec4 fcolor;

	if (stripe > .025)
		fcolor = firstCol;
	else
		fcolor = secondCol;

	return mix(fcolor, thirdCol, min(1., 1. - fromBorder * 2. + 0.1));
}

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

vec4 scolor(float c)
{
	return (vec4(pal(c, vec3(0.6,0.6,0.8),vec3(0.6,0.6,0.8),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67)), 1.0));
}

vec2 resolution2 = vec2(50., 50.);

vec4 star(vec2 fragCoord, vec2 coord)
{
    float branches = mod((-iTime), 7.);

	float	PI = 3.14159265358979323846264;
	float	radius = 0.42;
	float	a = cos(iTime * PI * 2.0) * 0.5;			// Rotation angle
	vec2	pos = (fragCoord.xy - coord) / resolution2.xy;	// Point from center
	pos *= mat2(cos(a), -sin(a), sin(a), cos(a));	// Rotation
	float	truc = atan(pos.x / pos.y) * branches;	// Position on circle
	if (pos.y < 0.)
		truc += mod(branches, 2.0) * PI;			// Symmetry
	float	dst = length(pos);
	if (branches > 1.0)
		dst *=  (cos(truc) + 3. ) / 2.;	// Curved distance
	else
	{
		dst *= 1.3;
		dst += (cos(iTime * PI * 20.) - 1.) * 0.1;
	}
	float	col = 1. - pow(abs(dst - radius) * 10., 2.);	// Glow factor
	float	bright;
	if (branches > 1.0)
		bright = sin(fract(branches) * PI);
	else
		bright = (cos(iTime * PI * 20.) + 1.) * 0.5;

	vec4 color = color(0xff, 0xa8, 0xf7, 0xff) +
		color(0x5f, 0x5f, 0x5f, 0xff) * bright;
	color = color * (col + pow(bright, 3.) * 0.5);
    color = vec4(max(0., color.r), max(0., color.g), max(0., color.b), max(0., color.a));
    return color;
}

vec4 egg(vec2 fragCoord, vec2 coord)
{
    float	radius = 0.8;	// circle radius
	float	miniRadius = 0.40;	// mini circles radius
	vec4	theColor = color(0xff, 0xed, 0x81, 0xff);
	float	PI = 3.14159265358979323846264;
	vec2	realPos = (fragCoord.xy - coord) / resolution2 * 2.;	// normalized position from center
	float	realL = length(realPos);
	float	a = 2.0;	// rotation angle
	vec2	uv = vec2(0.5 + asin(realPos.x / radius) / PI,	// sphere texture coords
					  0.5 + asin(realPos.y / radius) / PI);
	vec2	pos = uv;
	pos *= mat2(cos(a), -sin(a), sin(a), cos(a));	// rotation
	pos += vec2(sin(iTime * PI * 2.), cos(iTime * PI * 2.)) * 0.1;		// movement
	pos *= 4.;	// scale
	float t = floor(mod(pos.x, 2.)) * 2. + floor(mod(pos.y, 2.)) * 2.; // mini circle position factor
	pos.x = mod(pos.x, 1.);	// lil' circles
	pos.y = mod(pos.y, 1.);	// bis
	vec2 fromCenter = pos - vec2(0.5, 0.5);	// normalized position from center
	float	tst = length(fromCenter);		// distance from center
	float	col = pow(abs(tst - miniRadius) * 7., 2.);	// glow
	col *= cos(iTime * 4. * PI + t) * 0.3 + 0.5;	// time glow factor
	col = 1. - col;
	float	circle = pow(abs(realL - radius) * 7., 2.);	// glow
	circle *= cos(iTime * 4. * PI) * 0.4 + 0.7;	// time factor
	circle = 1. - circle;
	circle = min(1., max(0., circle));

    vec4 ret;
    
	if (realL < radius)	// circle interior
		ret = theColor * min(1., col + 0.04 / (radius - realL) * circle);
	else				// circle exterior
		ret = theColor * circle;
    ret = vec4(max(0., ret.r), max(0., ret.g), max(0., ret.b), max(0., ret.a));
    return ret;
}

vec4 orange(vec2 fragCoord, vec2 coord)
{
	float	radius = 0.42;
	float	PI = 3.14159265358979323846264;
	vec2	pos = (fragCoord.xy - coord) / resolution2;
	float	col = 0.;
	float	colCoef = 0.;

	vec4 col1 = color(0xff, 0xed, 0x81, 0xff);
	vec4 col2 = color(0xff, 0x20, 0x10, 0xff);
	vec4 ret = color(0, 0, 0, 0);

	const int circles = 6;
	for (int i = 0; i < circles; i++)
	{
		vec2 pos2 = pos;
		float circle_time = pow(1. - mod(iTime + float(i) * (1. / float(circles)), 1.), 1.5) * 1.5 * PI;
		pos2.x += sign(pos.x) * sqrt(radius * radius - pos.y * pos.y) * ((cos(circle_time) + 1.) / 2.);
		float tst = length(pos2);
		col = max((1. - pow(abs(tst - radius) * 15., 2.) * (cos(iTime * 4. * PI) + 2.)) / 1., 0.);
		colCoef = (1. - mod(iTime + float(i) * (1. / float(circles)), 1.)) * col;
		ret += (1. - ret.a) * mix(col2, col1, colCoef) * col;
	}
    return ret;
}


vec4 cut(vec2 fragCoord, vec2 coord)
{
	float debug = iTime;

	float	PI = 3.14159265358979323846264;
	const float	seg = 4.;
	vec2	pos = (fragCoord.xy - coord) / resolution2;	// Point from center
    
    if (abs(pos.x) > 0.5 || abs(pos.y) > 0.5)
		return vec4(0);

    pos = vec2(0.5, 0.5) + pos;
	pos = mod(pos, vec2(0.5, 0.5));
	pos -= vec2(0.25, 0.25);

	float	d = 0.;

	for (float i = 1.; i <= seg; i++)	// Computes distance from each segment
	{
		vec2	gridPos = (fragCoord.xy - coord) / resolution2;
		gridPos = floor(gridPos * 2.);
		float	radius = 0.22;
		float	timeMod;
		if (gridPos.x == -1.)
			timeMod = mod(iTime + 0.25 * (gridPos.x * 2. - gridPos.y - 1.), 1.);
		else if (gridPos.x == 0.)
			timeMod = mod(iTime + 0.25 * (gridPos.x * 2. + gridPos.y), 1.);
		float	a0 = 0.; // Square rotation angle
		if (timeMod < 0.5)
		{
			radius *= 1. - timeMod * 4.;
			a0 = cos (timeMod * 4. * 4.);
		}
		float	size = radius * sin(PI / seg);	// segment size / 2
		float	apot = radius * cos(PI / seg);	// segment distance from center
		vec2	p = pos * mat2(cos(a0), -sin(a0), sin(a0), cos(a0)); // Rotation
		float	a = i / seg * (2. * PI);
		p *= mat2(cos(a), -sin(a), sin(a), cos(a));	// Put segment horizontaly
		float	dst = 0.;

		if (p.x > -size && p.x < size)
		{
			dst = abs(apot - p.y);
		}
		else if (p.x <= -size)
		{
			dst = length(vec2(-size, apot) - p);
		}
		else if (p.x >= size)
		{
			dst = length(vec2(size, apot) - p);
		}
		if (d == 0. && dst != 0.)
			d = dst;
		else if (dst != 0.)
			d = min(d, dst);
	}

	vec4 snakeCol = scolor( mod(0.3 + index * 0.3, 1.0) );

	float	col = 1. - pow(abs(d) * 15., 2.);	// Glow factor

	return snakeCol * col;
}


vec4 triangle(vec2 fragCoord, vec2 coord)
{
    float ssize = 0.5;
    float rot = mod(iTime, 2.);
	float	test = iTime;
	float	PI = 3.14159265358979323846264;
	float	radius = ssize;
	const float	seg = 3.;
	float	size = radius * sin(PI / seg);	// segment size / 2
	float	apot = radius * cos(PI / seg);	// segment distance from center
	vec2	pos = (fragCoord.xy - coord) / resolution2;	// Point from center

	float	d = 0.;

	float	a = pow(1. - rot, 3.) * PI * 2. / seg * 7.;
	pos *= mat2(cos(a), -sin(a), sin(a), cos(a));	// Rotation

	for (float i = 1.; i <= seg; i++)	// Computes distance from each segment
	{
		float	a = i / seg * (2. * PI);
		vec2	p = pos * mat2(cos(a), -sin(a), sin(a), cos(a));	// Put segment horizontaly
		float	dst = 0.;

		if (p.x > -size && p.x < size)
		{
			dst = abs(apot - p.y);
		}
		else if (p.x <= -size)
		{
			dst = length(vec2(-size, apot) - p);
		}
		else if (p.x >= size)
		{
			dst = length(vec2(size, apot) - p);
		}
		if (d == 0. && dst != 0.)
			d = dst;
		else if (dst != 0.)
			d = min(d, dst);
	}

	float	col = 1. - pow(abs(d) * 30., 2.);	// Glow factor

    col = clamp(col, 0., 1.);
	vec4 ret = color(0x75, 0xee, 0xff, 0xff) * col;
    return ret;
}

vec4 ring(vec2 fragCoord, vec2 coord)
{
	float	radius = 0.42;
	float	PI = 3.14159265358979323846264;
	vec2	pos = (fragCoord.xy - coord) / resolution2;
	float	tst = length(pos);
	float	col;

	col = 1. - pow(abs(tst - radius) * 10., 2.) * (cos(iTime * 4. * PI) + 2.);
    col = clamp(col, 0., 1.0);
	return color(0xff, 0xed, 0x81, 0xff) * col;
}

vec4 head(vec2 fragCoord, vec2 coord, bool eye)
{
	float	PI = 3.14159265358979323846264;
	float	radius = 0.42;
	const float	seg = 4.;
	float	size = radius * sin(PI / seg);	// segment size / 2
	float	apot = radius * cos(PI / seg);	// segment distance from center
	vec2	pos = (fragCoord.xy - coord) / resolution2;	// Point from center

	float	d = 0.;

	float	a = PI / 4.;
	pos *= mat2(cos(a), -sin(a), sin(a), cos(a));	// Rotation

	for (float i = 1.; i <= seg; i++)	// Computes distance from each segment
	{
		float	a = i / seg * (2. * PI);
		vec2	p = pos * mat2(cos(a), -sin(a), sin(a), cos(a));	// Put segment horizontaly
		float	dst = 0.;

		if (p.x > -size && p.x < size)
		{
			dst = abs(apot - p.y);
		}
		else if (p.x <= -size)
		{
			dst = length(vec2(-size, apot) - p);
		}
		else if (p.x >= size)
		{
			dst = length(vec2(size, apot) - p);
		}
		if (d == 0. && dst != 0.)
			d = dst;
		else if (dst != 0.)
			d = min(d, dst);
	}

	float	col = 1. - pow(abs(d) * 15., 2.);	// Glow factor
	col = max(0., min(1., col));
    float colEye = 0.;
    if (eye)
		colEye = 1. - pow(length(pos) * 6., 2.) * (cos(iTime * 4. * PI) * 0.5 + 0.9);	// Time factor
	colEye = max(0., min(1., colEye));
    
    col = clamp(col, 0., 1.);
    colEye = clamp(colEye, 0., 1.);

	vec4 eyeCol = scolor( mod(0.7 + index * 0.3, 1.0) );
	eyeCol *= 1.2;
	vec4 snakeCol = scolor( mod(0.3 + index * 0.3, 1.0) );
	return eyeCol * colEye + col * snakeCol;
}

vec4 block(vec2 fragCoord, vec2 coord)
{
	vec4	snakeCol = color(0xff, 0x6a, 0x32, 0xff);
	float	debug = iTime;

	float	PI = 3.14159265358979323846264;
	float	radius = 0.6;
	const float	seg = 4.;
	float	size = radius * sin(PI / seg);	// segment size / 2
	float	apot = radius * cos(PI / seg);	// segment distance from center
	vec2	pos = (fragCoord.xy - coord) / resolution2;	// Point from center

	float	d = 0.;

	for (float i = 1.; i <= seg; i++)	// Computes distance from each segment
	{
		float	a = i / seg * (2. * PI);
		vec2	p = pos * mat2(cos(a), -sin(a), sin(a), cos(a));	// Put segment horizontaly
		float	dst = 0.;

		if (p.x > -size && p.x < size)
		{
			dst = abs(apot - p.y);
		}
		else if (p.x <= -size)
		{
			dst = length(vec2(-size, apot) - p);
		}
		else if (p.x >= size)
		{
			dst = length(vec2(size, apot) - p);
		}
		if (d == 0. && dst != 0.)
			d = dst;
		else if (dst != 0.)
			d = min(d, dst);
	}
	d = mod(d + 0.05, 0.3) - 0.05;
	float	col = 1. - pow(abs(d) * 10., 1.);	// Glow factor
    col = clamp(col, 0., 1.);

	return snakeCol * col;
}

vec4 walls(vec2 fragCoord)
{
	vec2 c = mod(fragCoord, resolution2);
    if (fragCoord.x < resolution2.x || fragCoord.y < resolution2.y
        || iResolution.x - fragCoord.x < resolution2.x
        || iResolution.y - fragCoord.y < resolution2.y)
		return block(c, resolution2 / 2.);
    return vec4(0);
}

vec2 wave_offset(vec2 fragCoord, vec2 tpos, float tsize)
{
	float	PI = 3.14159265358979323846264;
    
    vec2 texPos = fragCoord / iResolution.xy - tpos;

	float dst = (length(texPos) - tsize) * 16.;
	float coef = 0.0;

	if (dst < 1. && dst > -1.) // If in the wave
	{
		coef = -1. + cos(dst * PI + PI); // Wave slope
		texPos += normalize(texPos) * coef / 100.; // Texture offset with slope
	}
    texPos += tpos;

	return texPos * iResolution.xy
        ;
}

float wave_coef(vec2 fragCoord, vec2 tpos, float tsize)
{
	float	PI = 3.14159265358979323846264;
    
    vec2 texPos = fragCoord - tpos;

	float dst = (length(texPos) - tsize) * 16.;
	float coef = 0.0;

	if (dst < 1. && dst > -1.) // If in the wave
	{
		coef = -1. + cos(dst * PI + PI); // Wave slope
	}

	return coef;
}

vec2 start = vec2(100., 100.) + vec2(50., 50.) / 2.;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float wave_size = mod(iTime / 2., 1.);
    fragCoord = wave_offset(fragCoord, vec2(0.5, 0.5), wave_size);
    
    vec4 bgc = bg(fragCoord);
	vec4 c = star(fragCoord, start);
    c += egg(fragCoord, start + vec2(resolution2.x, 0.));
    c += orange(fragCoord, start + vec2(resolution2.x * 2., 0.));
    c += cut(fragCoord, start + vec2(resolution2.x * 3., 0.));
    c += triangle(fragCoord, start + vec2(resolution2.x * 4., 0.));
    c += ring(fragCoord, start + vec2(0., resolution2.y));
    
    float dec = mod(iTime, 1.) * resolution2.x;
    vec2 sstart = start + vec2(resolution2.x * 3., resolution2.y * 4.);
    c += head(fragCoord, sstart + vec2(dec, 0.), floor(mod(iTime, 4.)) == 3.);
    c += head(fragCoord, sstart + vec2(0., -dec + resolution2.y), floor(mod(iTime, 4.)) == 2.);
	c += head(fragCoord, sstart + vec2(-dec + resolution2.x, resolution2.y), floor(mod(iTime, 4.)) == 1.);
    c += head(fragCoord, sstart + vec2(resolution2.x, dec), floor(mod(iTime, 4.)) == 0.);
    
    c += walls(fragCoord);

    fragColor = mix(bgc, c, clamp(c.a, 0., 1.));
    fragColor = vec4(fragColor.rgb * (1. - (wave_coef(fragCoord / iResolution.xy, vec2(0.5, 0.5), wave_size) / 2.)), 1.); // Lightens texture according to slope

}


void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	gl_FragColor = vec4(0,0,0,0);
	mainImage(gl_FragColor, gl_FragCoord.xy);
}