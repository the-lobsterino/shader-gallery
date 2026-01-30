#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray
{
	vec3 o;
	vec3 d;
};

float torusDst( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float sphereDst(vec3 p, vec3 pos, float sRad)
{
	return length(pos - p) - sRad;
}

float boxDst(vec3 p, vec3 pos, vec3 b)
{
	vec3 d = abs(pos - p) - b;
	return length(max(d, 0.0)) + min(max(d.x, max(d.y,d.z)), 0.0);
}

vec3 repeat( vec3 p, vec3 c )
{
    return mod(p,c)-0.5*c;
}

float calcDst(vec3 p)
{
	vec3 repeatP = repeat(p, vec3(5.0, 5.0, 5.0));
	return max(torusDst(repeatP, vec2(1.5, 1.1)), sphereDst(repeatP, vec3(0.0, 0.0, 0.0), 1.0 + sin(time) * 0.5));
}

vec3 calcNormal(vec3 p)
{
	float delta = 0.001;
	vec3 v;
	v.x = calcDst(p + vec3(delta, 0.0, 0.0)) - calcDst(p + vec3(-delta, 0.0, 0.0));
	v.y = calcDst(p + vec3(0.0, delta, 0.0)) - calcDst(p + vec3(0.0, -delta, 0.0));
	v.z = calcDst(p + vec3(0.0, 0.0, delta)) - calcDst(p + vec3(0.0, 0.0, -delta));
	return normalize(v);
}

bool findIntersectionPosition(Ray r, out vec3 p)
{
	p = r.o;
	
	for(int i = 0; i < 100; ++i)
	{
		float dst = calcDst(p);
		
		p += r.d * dst;
		
		if(dst < 0.001)
		{
			return true;
		}
	}
	
	return false;
}

void main( void ) {

	vec2 screenPosition = (( gl_FragCoord.xy / resolution.xy ) - 0.5) * 2.0;
	screenPosition.x *= resolution.x / resolution.y;
	
	vec3 color = vec3(0.0, 0.0, 0.0);
	
	vec3 cameraPos = vec3(0.0, 1.0, -2.0 + time);
	
	vec3 up = vec3(0.0, 1.0, 0.0);
	vec3 lookAt = vec3(0.0, 0.0, 1.0);
	vec3 right = cross(up, lookAt);
	
	vec3 cameraDir = normalize(right * screenPosition.x + up * screenPosition.y + lookAt);
	
	vec3 colorMul = vec3((sin(time * 0.323) + 1.0) / 2.0, (cos(time * 1.2) + 1.0) / 2.0, (sin(time * 0.482) + 1.0) / 2.0);
	
	vec3 lightPos = vec3(0.0, 0.0, 0.0);
	
	Ray startRay;
	startRay.o = cameraPos;
	startRay.d = cameraDir;
	
	vec3 position = vec3(0.0);
	
	if(findIntersectionPosition(startRay, position))
	{
		vec3 normal = calcNormal(position);
			
		vec3 lightDir = normalize(position - lightPos);
		
		float lightIntensity = dot(normal, -lightDir);
		
		if(lightIntensity > 0.0)
		{
			color += colorMul * lightIntensity;
		}
		
		vec3 reflectDir = normalize(reflect(cameraDir, normal));
		
		float specularIntensity = dot(reflectDir, -lightDir);
		
		if(specularIntensity > 0.0)
		{
			specularIntensity = pow(specularIntensity, 64.0);
			color += specularIntensity;
		}
	}

	gl_FragColor = vec4( color, 1.0 );

}