//  Mini version by //Harley  -- for some 4K stuff ;-)
// note2self : fix numbers and use http://ctrl-alt-test.fr/minifier/index   -in release version
// ideas are welcome... Think Crack-tro in 1Kb/4Kb 
// re-run the text with more info + full font(from old version?).. 
//like a oldschool Amiga cracktro (code:xxx <shift> Music:xxx <shift> release: xx <shift> cracked by:xx  ) ;-)
#ifdef GL_ES
precision highp float;
#endif
float check(vec2 p, float size) {return mod(floor(p.x * size) + floor(p.y * size),3.0);}
uniform float time;
uniform vec2 resolution;
float ds(vec2 p0,vec2 p1,vec2 uv)
{
	vec2 dir = normalize(p1 - p0);
	uv = (uv - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
	return distance(uv, clamp(uv, vec2(0), vec2(distance(p0, p1), 0)));   
}
bool bit(float n, float b)
{	return mod(floor(n / exp2(floor(b))), 2.0) != 0.0; }
float dd(float bi, vec2 uv)
{
	float d = 1e6;		float n = floor(bi);
	if(bi != 0.0)
	{
		d = bit(n,  0.0) ? min(d, ds(vec2( 0.500,  0.063), vec2( 0.500,  0.937), uv)) : d;
		d = bit(n,  1.0) ? min(d, ds(vec2( 0.438,  1.000), vec2( 0.063,  1.000), uv)) : d;
		d = bit(n,  2.0) ? min(d, ds(vec2(-0.063,  1.000), vec2(-0.438,  1.000), uv)) : d;
		d = bit(n,  3.0) ? min(d, ds(vec2(-0.500,  0.937), vec2(-0.500,  0.062), uv)) : d;
		d = bit(n,  4.0) ? min(d, ds(vec2(-0.500, -0.063), vec2(-0.500, -0.938), uv)) : d;
		d = bit(n,  5.0) ? min(d, ds(vec2(-0.438, -1.000), vec2(-0.063, -1.000), uv)) : d;
		d = bit(n,  6.0) ? min(d, ds(vec2( 0.063, -1.000), vec2( 0.438, -1.000), uv)) : d;
		d = bit(n,  7.0) ? min(d, ds(vec2( 0.500, -0.938), vec2( 0.500, -0.063), uv)) : d;
		d = bit(n,  8.0) ? min(d, ds(vec2( 0.063,  0.000), vec2( 0.438, -0.000), uv)) : d;
		d = bit(n,  9.0) ? min(d, ds(vec2( 0.063,  0.063), vec2( 0.438,  0.938), uv)) : d;
		d = bit(n, 10.0) ? min(d, ds(vec2( 0.000,  0.063), vec2( 0.000,  0.937), uv)) : d;
		d = bit(n, 11.0) ? min(d, ds(vec2(-0.063,  0.063), vec2(-0.438,  0.938), uv)) : d;
		d = bit(n, 12.0) ? min(d, ds(vec2(-0.438,  0.000), vec2(-0.063, -0.000), uv)) : d;
		d = bit(n, 13.0) ? min(d, ds(vec2(-0.063, -0.063), vec2(-0.438, -0.938), uv)) : d;
		d = bit(n, 14.0) ? min(d, ds(vec2( 0.000, -0.938), vec2( 0.000, -0.063), uv)) : d;
		d = bit(n, 15.0) ? min(d, ds(vec2( 0.063, -0.063), vec2( 0.438, -0.938), uv)) : d;
	}
	return d;
}
float c_i = float(0x4466);float c_m = float(0x0A99);float c_o = float(0x00FF);float c_r = float(0x911F);
float c_1 = float(0x4400);float c_2 = float(0x1177);float c_6 = float(0x11FE);
const int NC = 21;
void main( void ) 
{
	vec2 p = ((gl_FragCoord.xy / resolution) - 0.5) * 2.0;
	p.x *= resolution.x/resolution.y;	
	p /= dot(p, p);
	float t = sin(time*5. + (10.0*0.1)*distance(p, vec2(1.0)))*0.2;
	p *= mat2(cos(t), tan(t), (t),  cos(t)	);

	vec2 as = resolution.xy / resolution.y;
	vec2 uv = ( gl_FragCoord.xy / resolution.y );
	uv -= as / 1.7;
	uv *= 11.0;
	float di = 1e1;
	float an = clamp(time * 0.25, 0.0, 1.0) * 16.0;
	float ch[NC];
	ch[ 0] = mix(0.0, c_m, clamp(an - 0.0, 0.0, 1.0));	ch[ 1] = mix(0.0, c_i, clamp(an - 1.0, 0.0, 1.0));
	ch[ 2] = mix(0.0, c_r, clamp(an - 2.0, 0.0, 1.0));	ch[ 3] = mix(0.0, c_r, clamp(an - 3.0, 0.0, 1.0));
	ch[ 4] = mix(0.0, c_o, clamp(an - 3.0, 0.0, 1.0));	ch[ 5] = mix(0.0, c_r, clamp(an - 4.0, 0.0, 1.0));
	ch[ 6] = 0.1;
	ch[ 7] = mix(0.0, c_2, clamp(an - 6.0, 0.0, 1.0));	ch[ 8] = mix(0.0, c_o, clamp(an - 7.0, 0.0, 1.0));
	ch[ 9] = mix(0.0, c_1, clamp(an - 8.0, 0.0, 1.0));	ch[10] = mix(0.0, c_6, clamp(an - 9.0, 0.0, 1.0));
	ch[11] = 0.1;
	vec2 ch_i = vec2(1.0, 2.0);vec2 ch_s = ch_i + vec2(0.25,0.25);
	vec2 offs = vec2(-ch_s.x * 5.5,0.0);	for(int i = 0;i < NC;i++) 
	{ di = min(di, dd(ch[i] , uv - offs)); offs.x += ch_s.x;}
	
	vec3 co = vec3(0.0);
	co = mix(vec3(2.0,0.8,0.1), vec3(0.0,0.0,0.0), smoothstep(0.01, 0.05, di) - (0.01 / di));
	gl_FragColor = vec4(co, 1.0) + vec4(check(p, 7.0) * (11.0/length(p))*0.04);
	
}