#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

//We'll do better next time...


float Hash( vec2 p)
{
	vec3 p2 = vec3(p.xy,1.0);
    return fract(sin(dot(p2,vec3(37.1,61.7, 12.4)))*3758.5453123);
}

float noise(in vec2 p)
{
    vec2 i = floor(p);
	vec2 f = fract(p); 
	f *= f * (3.0-2.0*f);

    return mix(mix(Hash(i + vec2(0.,0.)), Hash(i + vec2(1.,0.)),f.x),
			mix(Hash(i + vec2(0.,1.)), Hash(i + vec2(1.,1.)),f.x),
			f.y);
		
		
}

float fbm(vec2 p) {
	float v = 0.0;
	v += noise(p*1.)*.5;
	v += noise(p*2.)*.25;
	v += noise(p*4.)*.125;
	return v;
}

void main(void) {

	vec2 pos = surfacePosition;
	pos.y += (0.6 + pos.x) * sin(pos.x * 6.0 - time * 4.0) * 0.04;
	float shade = 0.8 + (0.6 + pos.x) * cos(pos.x * 6.0 - time * 4.0) * 0.2;

	float flag=0.0;
	vec3 color = vec3(0.0);
	if(abs(pos.x) < 0.6 && abs(pos.y) < 0.4) {
		if(abs(pos.y) < 0.1)  color = vec3(0.8, 0.18, 0.22);
		else color = vec3(1.0);
		flag = 1.0;
	}

	color*=shade;
	
	float d = pos.x+pos.y*0.5-0.3;
	d+=0.5*fbm(pos*15.1);
	flag *= (d > 0.5) ? 0.0 : 1.0;
	color*=flag;
	
	if (d >0.35)
		color = clamp((color-(d-0.35)*10.),0.0,1.0);
	if (d >0.47)
	{
		float b = (d-0.4)*33.0;
		color += flag*b*0.5*(0.0+noise(100.*pos+vec2(-time*3.,0.)))*vec3(1.5,0.5,0.0);
	}
	float s = clamp(1.0-length((pos-vec2(0.5+0.25*pos.y*pos.y,0.7))*vec2(2.5-pos.y*pos.y,1.0)),0.0,1.0);
	float f = clamp(1.0-length((pos-vec2(0.5+pos.y*0.1*sin(pos.y+time*10.),0.2))*vec2(4.0+pos.y*pos.y,2.0)),0.0,1.0);
	
	s*=fbm((pos+time*vec2(-0.2,-0.5))*5.1);
	color = mix(color,vec3(s),s*3.);
	f*=f*fbm((pos+time*vec2(-0.0,-0.8))*10.);
	f=f;
	
	
	vec3 flame = clamp(f*vec3((3.0-pos.y)*2.0,(1.3-pos.y)*2.0,pos.y-2.0),0.0,1.0);
	color+=flame;

	
	
	
	
	gl_FragColor = vec4(color, 1.0);
}