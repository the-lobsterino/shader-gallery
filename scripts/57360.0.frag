

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}
float triangle(vec2 p) {
	
	p.x *= 0.866;
	p.x = abs(p.x);
	p.y += 0.5;
	return max(2. * p.x + p.y, 1. - 1.5 * p.y);
}

vec3 shaded_triangle(vec2 p) {
	float d = triangle(p);
	d = 1. - smoothstep(0.3, 0.9, d);
	return d * vec3(0.0, 1.0, 1.0); 
}

vec3 Uncharted2Tonemap(vec3 x)
{
    float A = 0.15;
	float B = 0.50;
	float C = 0.10;
	float D = 0.20;
	float E = 0.02;
	float F = 0.30;

    return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
}

const vec3 LUM_FACTOR = vec3(0.299, 0.587, 0.114);

const float eps = 0.0000001;
vec3 hsv2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    return c.z * mix( vec3(1.0), rgb, c.y);
}

vec3 hsl2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}


vec3 rgb2hsv( in vec3 c)
{
    vec4 k = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.zy, k.wz), vec4(c.yz, k.xy), (c.z<c.y) ? 1.0 : 0.0);
    vec4 q = mix(vec4(p.xyw, c.x), vec4(c.x, p.yzx), (p.x<c.x) ? 1.0 : 0.0);
    float d = q.x - min(q.w, q.y);
    return vec3(abs(q.z + (q.w - q.y) / (6.0*d+eps)), d / (q.x+eps), q.x);
}

vec3 rgb2hsl( vec3 col )
{
    float minc = min( col.r, min(col.g, col.b) );
    float maxc = max( col.r, max(col.g, col.b) );
    vec3  mask = step(col.grr,col.rgb) * step(col.bbg,col.rgb);
    vec3 h = mask * (vec3(0.0,2.0,4.0) + (col.gbr-col.brg)/(maxc-minc + eps)) / 6.0;
    return vec3( fract( 1.0 + h.x + h.y + h.z ),              // H
                 (maxc-minc)/(1.0-abs(minc+maxc-1.0) + eps),  // S
                 (minc+maxc)*0.5 );                           // L
}



void main() {
	vec2 p = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
	float speed = 2.;
	
	vec2 circle1 = vec2(sin(time * speed), cos(time * 1.0));
	vec2 circle2 = vec2(cos(time * speed), sin(time * 1.0));
	vec2 circle3 = vec2(sin((time + 22.5) * speed), cos((time + 45.) * 1.0));
	vec2 circle4 = vec2(cos((time + 22.5) * speed), sin((time + 45.) * 1.0));
	
	col += shaded_triangle(p + circle1 / 2.);
	col += shaded_triangle(p + circle2 / 2.);
	col += shaded_triangle(p + circle3 / 2.);
	col += shaded_triangle(p + circle4 / 2.);
	//col += shaded_triangle(p+0.5);
	
	//col += shaded_triangle(p+vec2(-0.2, 0.2));
	
	// NOTE: at this point col has values above 1.0 here for overlapping parts
	
	// clamp
	// col = clamp(col, 0., 1.);
	
	// global tone mapping
	// col = col / (1.0 + col);
	
	
	// gamma compress
	//col = mouse.x * pow(col, vec3(1.0 / mouse.y));
	
	// exp
	//col = vec3(1.0) - exp(-col * mouse.x);
	
	//col = Uncharted2Tonemap(col);
	col = rgb2hsv(col);
	col.x = time / 2.0;
	col.y = col.y / (1.0 + col.y);
	col.z *= 1.1;
	col = hsv2rgb(col);
	
	// pure for comparasion
	//col = max(col, shaded_triangle(p + vec2(-1.0, 0.0)));
	

	gl_FragColor = vec4(col, 1.);
}