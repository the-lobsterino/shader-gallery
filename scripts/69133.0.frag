#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 trans(vec3 p)
{
	return mod(p,4.0*2.0)-2.0;	
}

float Sphere(vec3 pos,float size)
{
	return length(trans(pos))-size;
}

vec3 getNormal(vec3 pos, float size)
{
    float ep = 0.0001;
    return normalize(vec3(
            Sphere(pos, size) - Sphere(vec3(pos.x - ep, pos.y, pos.z), size),
            Sphere(pos, size) - Sphere(vec3(pos.x, pos.y - ep, pos.z), size),
            Sphere(pos, size) - Sphere(vec3(pos.x, pos.y, pos.z - ep), size)
        ));
}

vec3 hsv2rgb(float h,float s,float v)
{
	return ((clamp(abs(fract(h+vec3(0,2,1)/3.)*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;
}

//PerlinNoise
float rand(vec2 st)
{
	  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 1);
}

float PerlinNoise(float x)
{
	float aL = rand(vec2(floor(x), 0.1));
	float aR = rand(vec2(floor(x + 1.0), 0.1));
	float wL = aL * fract(x);
	float wR = aR * (fract(x) - 1.0);
	float f = fract(x);
	float u = pow(f, 2.0) * (3.0 - 2.0 * f);
	float n = mix(wL, wR, u);
	return n;
}


void main( void ) {
	vec2 pos=(gl_FragCoord.xy*2.0-resolution.xy)/min(resolution.x,resolution.y);
	
	vec3 cameraPos=vec3(0,0,10);
	//cameraPos.xy=mouse;
	vec3 lightPos=normalize(vec3(1.0,1.0,1.0));
	
	vec4 col=vec4(0.0);
	col.a=1.0;
	
	vec3 ray=normalize(vec3(pos,0.0)-cameraPos);
	vec3 cur=cameraPos;
	
	for(int i=0;i<64;i++)
	{
		float d=Sphere(cur,0.5);
		d=Sphere(cur,0.5+PerlinNoise(d+time));
		if(d<0.001)
		{
			vec3 normal=getNormal(cur,0.5);
			float diff=dot(normal,lightPos);
			
			col.rgb=vec3(1.0)*diff*hsv2rgb(length(cur*0.1)+PerlinNoise(time),1.0,1.0)*3.0;
			break;
		}
		cur+=ray*d;
		
	}
	
	gl_FragColor = col;

}