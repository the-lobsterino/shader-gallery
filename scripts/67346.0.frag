#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution
#define A5
#define occlusion_enabled
#define occlusion_quality 4
#define noise_use_smoothstep
#define light_color vec3(0.1,0.4,0.6)
#define light_direction normalize(vec3(.2,1.0,-0.2))
#define light_speed_modifier 1.0
#define object_color vec3(0.9,0.1,0.1)
#define object_count 16
#define object_speed_modifier 1.0
#define render_steps 33
const vec4 iMouse = vec4(0.0);
float hash(float x)
{
	return fract(sin(x*.0127863)*17143.321);
}

float hash(vec2 x)
{
	return fract(cos(dot(x.xy,vec2(2.31,53.21))*124.123)*412.0); 
}

vec3 cc(vec3 color, float factor,float factor2)
{
	float w = color.x+color.y+color.z;
	return mix(color,vec3(w)*factor,w*factor2);
}

float hashmix(float x0, float x1, float interp)
{
	x0 = hash(x0);
	x1 = hash(x1);
	#ifdef noise_use_smoothstep
	interp = smoothstep(0.0,1.0,interp);
	#endif
	return mix(x0,x1,interp);
}

float noise(float p)
{
	float pm = mod(p,10.0);
	float pd = p-pm;
	return hashmix(pd,pd+1.0,pm);
}

vec3 rotate_y(vec3 v, float angle)
{
	float ca = cos(angle); float sa = sin(angle);
	return v*mat3(
		+ca, +.0, -sa,
		+.0,+1.0, +.0,
		+sa, +.0, +ca);
}

vec3 rotate_x(vec3 v, float angle)
{
	float ca = cos(angle); float sa = sin(angle);
	return v*mat3(
		+1.0, +.0, +.0,
		+.0, +ca, -sa,
		+.0, +sa, +ca);
}

float max3(float a, float b, float c)
{
	return max(a,max(b,c));
}

vec3 bpos[object_count];

float dist(vec3 p)
{
	float d=256.0;
	float nd;
	for (int i=0 ;i<object_count; i++)
	{
		vec3 np = p+bpos[i];
		float shape0 = max3(abs(np.x),abs(np.y),abs(np.z))-1.0;
		float shape1 = length(np)-1.0;
		nd = shape0+(shape1-shape0)*2.0;
		d = mix(d,nd,smoothstep(-1.0,+1.0,d-nd));
	}
	return d;
}

vec3 normal(vec3 p,float e)
{
	float d=dist(p);
	return normalize(vec3(dist(p+vec3(e,0,0))-d,dist(p+vec3(0,e,0))-d,dist(p+vec3(0,0,e))-d));
}

vec3 light = light_direction;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 background(vec3 d)
{
	float t=iTime*0.5*light_speed_modifier;
	float qq = dot(d,light)*.5+.5;
	float bgl = qq;
	float q = (bgl+noise(bgl*6.0+t)*.85+noise(bgl*12.0+t)*.85);
	q+= pow(qq,32.0)*2.0;
	vec3 sky = vec3(0.1,0.4,0.6)*q;
    vec3 hsv_sky = rgb2hsv(sky);
    hsv_sky.x += t/10.0;
    hsv_sky.z += 0.1;
    sky = hsv2rgb(hsv_sky);
	return sky;
}

float occlusion(vec3 p, vec3 d)
{
	float occ = 1.0;
	p=p+d;
	for (int i=0; i<occlusion_quality; i++)
	{
		float dd = dist(p);
		p+=d*dd;
		occ = min(occ,dd);
	}
	return max(.0,occ);
}

vec3 object_material(vec3 p, vec3 d)
{
	vec3 color = normalize(object_color*light_color);
	vec3 n = normal(p,0.1);
	vec3 r = reflect(d,n);	
	
	float reflectance = dot(d,r)*.5+.5;reflectance=pow(reflectance,2.0);
	float diffuse = dot(light,n)*.5+.5; diffuse = max(.0,diffuse);
	
	#ifdef occlusion_enabled
		float oa = occlusion(p,n)*.4+.6;
		float od = occlusion(p,light)*.95+.05;
		float os = occlusion(p,r)*.95+.05;
	#else
		float oa=1.0;
		float ob=1.0;
		float oc=1.0;
	#endif
	
	#ifndef occlusion_preview
		color = color*oa*.2 + color*diffuse*od*.7 + background(r)*os*reflectance*.7;
	#else
		color=vec3((oa+od+os)*.3);
	#endif
	
	return color;
}

#define offset1 4.7
#define offset2 4.6

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy - 0.5;
	uv.x *= iResolution.x/iResolution.y; 
	vec3 mouse = vec3(iMouse.xy/iResolution.xy - 0.5,iMouse.z-.5);
	
	float t = iTime*.5*object_speed_modifier + 2.0;
	
	for (int i=0 ;i<object_count; i++)
	{
        float wave_movement = sin(t + float(i));
		bpos[i] = 3.0*wave_movement*wave_movement*vec3(
			sin(t*0.967+float(i)*42.0),
			sin(t*.423+float(i)*152.0),
			sin(t*.76321+float(i)));
	}
	vec3 p = vec3(.0,0.0,-4.0);
	p = rotate_x(p,mouse.y*9.0+offset1);
	p = rotate_y(p,mouse.x*9.0+offset2);
	vec3 d = vec3(uv,1.0);
	d.z -= length(d)*.5;
	d = normalize(d);
	d = rotate_x(d,mouse.y*9.0+offset1);
	d = rotate_y(d,mouse.x*9.0+offset2);

	float dd;
	vec3 color;
	for (int i=0; i<render_steps; i++)
	{
		dd = dist(p);
		p+=d*dd*.7;
		if (dd<.04 || dd>4.0) break;
	}
	
	if (dd<0.5)
    {
		color = object_material(p,d);
        color.r += .3 + sin(iTime)/10.0;
        color.b += .2 + uv.y + cos(iTime)/10.0;
        color.g += .1 + uv.x - uv.y/2.0 + sin(iTime)/10.0;
        color *= (.7 + background(d)/2.0);
    }
	else
		color = background(d);

	color *=.85;
	color = mix(color,color*color,0.3);
	color -= hash(color.xy+uv.xy)*.015;
	color -= length(uv)*.1;
	color =cc(color,.5,.6);

    vec3 hsv_color = rgb2hsv(color);
    hsv_color.y += 0.05;
    hsv_color.z += 0.05;
    color = hsv2rgb(hsv_color);
	fragColor = vec4(color,1.0);
}


void main(void)
{
//iMouse = vec4(mouse * resolution, 0.0, 0.0);    
mainImage(gl_FragColor, gl_FragCoord.xy);
gl_FragColor.a = 1.0;
}